const fs = require('fs');
const axios = require('axios');
const mime = require('mime-types');
const sharp = require('sharp');
const { rgbToHex } = require('../utils/colorUtils');

// Hugging Face API configuration
const HF_API_TOKEN = process.env.HF_API_TOKEN;
// Using the proven DETR model for object detection
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/detr-resnet-50';
// Alternative model as fallback
const HF_FALLBACK_URL = 'https://api-inference.huggingface.co/models/facebook/detr-resnet-101';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second (reduced from 2 seconds)
const REQUEST_TIMEOUT = 45000; // 45 seconds (increased for cold starts)

// Function to wait for a specified amount of time
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to warm up the model (send a small dummy request)
async function warmupModel(apiUrl) {
  try {
    console.log('Warming up model...');
    // Create a small 1x1 pixel image for warmup
    const dummyImage = await sharp({
      create: {
        width: 1,
        height: 1,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    }).jpeg().toBuffer();

    await axios.post(apiUrl, dummyImage, {
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'image/jpeg',
      },
      timeout: 10000, // Short timeout for warmup
    });
    console.log('Model warmed up successfully');
    return true;
  } catch (error) {
    console.log('Model warmup failed (this is normal for cold models)');
    return false;
  }
}

// Function to analyze image with Hugging Face (with retry logic)
async function analyzeImage(filePath) {
  let lastError;
  let currentApiUrl = HF_API_URL;
  
  // Check if we have API token
  if (!HF_API_TOKEN) {
    console.error('HF_API_TOKEN not found in environment variables');
    return {
      error: 'Hugging Face API token not configured',
      details: 'Please set HF_API_TOKEN environment variable',
      suggestion: 'Contact administrator to configure the AI service'
    };
  }
  
  // Try to warm up the primary model first
  await warmupModel(currentApiUrl);
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Analyzing image - Attempt ${attempt}/${MAX_RETRIES} using ${currentApiUrl.includes('detr-resnet-101') ? 'DETR-101' : 'DETR-50'} model`);
      
      // Read file as binary data
      const imageBuffer = fs.readFileSync(filePath);
      
      // Get the actual content type
      const contentType = mime.lookup(filePath) || 'application/octet-stream';
      
      const response = await axios.post(currentApiUrl, imageBuffer, {
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
          'Content-Type': contentType,
        },
        timeout: REQUEST_TIMEOUT,
        validateStatus: function (status) {
          // Accept 2xx status codes and 503 (service unavailable) for retry
          return (status >= 200 && status < 300) || status === 503;
        }
      });
      
      // If we get a 503, treat it as a retryable error
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable (503)');
      }
      
      // Check if response is valid
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from Hugging Face API');
      }
      
      console.log('Hugging Face API Response received successfully');
      console.log('Number of detections:', response.data.length);
      return response.data;
      
    } catch (error) {
      lastError = error;
      
      // Log the error details
      if (error.response) {
        console.error(`Attempt ${attempt} - Hugging Face API Error:`, {
          status: error.response.status,
          statusText: error.response.statusText,
          model: currentApiUrl.includes('detr-resnet-101') ? 'DETR-101' : 'DETR-50',
          errorData: typeof error.response.data === 'string' && error.response.data.length < 500 ? 
                     error.response.data : 'Response data too large or not a string'
        });
        
        // Don't retry on authentication errors (401, 403) or client errors (4xx except 429)
        if (error.response.status === 401 || error.response.status === 403) {
          console.error('Authentication error - check your Hugging Face API token');
          break;
        } else if (error.response.status >= 400 && error.response.status < 500 && error.response.status !== 429) {
          console.error('Non-retryable client error detected, stopping retries');
          break;
        }
      } else {
        console.error(`Attempt ${attempt} - Network/Timeout Error:`, error.message);
      }
      
      // Switch to fallback model after first failure
      if (attempt === 1 && currentApiUrl === HF_API_URL) {
        console.log('Switching to fallback model (DETR-101)...');
        currentApiUrl = HF_FALLBACK_URL;
        await warmupModel(currentApiUrl);
      }
      
      // If this wasn't the last attempt, wait before retrying
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * attempt; // Linear backoff (reduced)
        console.log(`Waiting ${delay}ms before retry...`);
        await wait(delay);
      }
    }
  }
  
  // If all retries failed, return error with fallback
  console.error('All retry attempts failed for Hugging Face API');
  
  // Try to extract basic color information as fallback
  try {
    const colorInfo = await extractDominantColors(filePath);
    if (!colorInfo.error) {
      console.log('Fallback: Using color analysis only');
      return {
        error: 'Object detection unavailable, using color analysis only',
        fallback: true,
        colors: colorInfo,
        // Return some basic furniture objects as a fallback for UI
        objects: [
          { label: 'furniture', score: 0.3, box: { xmin: 0, ymin: 0, xmax: 100, ymax: 100 } }
        ]
      };
    }
  } catch (fallbackError) {
    console.error('Fallback color extraction also failed:', fallbackError);
  }
  
  return { 
    error: 'Failed to analyze image after multiple attempts', 
    details: lastError?.message || 'Unknown error',
    suggestion: 'The AI service may be temporarily unavailable. Please try again later.'
  };
}

// Extract dominant colors from image
async function extractDominantColors(filePath) {
  try {
    // Get image stats including dominant color
    const { dominant } = await sharp(filePath).stats();
      
    // Convert the dominant color to hex
    const dominantHex = rgbToHex([dominant.r, dominant.g, dominant.b]);
    
    // Extract a color palette using regions of the image
    const { info: metadata } = await sharp(filePath).toBuffer({ resolveWithObject: true });
    const width = metadata.width;
    const height = metadata.height;
    
    // Create regions to sample colors from
    const regions = [
      { left: 0, top: 0, width: Math.floor(width/2), height: Math.floor(height/2) },
      { left: Math.floor(width/2), top: 0, width: Math.floor(width/2), height: Math.floor(height/2) },
      { left: 0, top: Math.floor(height/2), width: Math.floor(width/2), height: Math.floor(height/2) },
      { left: Math.floor(width/2), top: Math.floor(height/2), width: Math.floor(width/2), height: Math.floor(height/2) }
    ];
    
    // Get dominant color for each region
    const palettePromises = regions.map(region => {
      return sharp(filePath)
        .extract(region)
        .stats()
        .then(stats => {
          return [stats.dominant.r, stats.dominant.g, stats.dominant.b];
        });
    });
    
    const palette = await Promise.all(palettePromises);
    const hexPalette = palette.map(rgb => rgbToHex(rgb));
    
    // Remove duplicates from palette
    const uniquePalette = [...new Set(hexPalette)];
    
    return {
      dominant: dominantHex,
      palette: uniquePalette
    };
  } catch (error) {
    console.error('Color extraction error:', error);
    return { error: 'Failed to extract colors', details: error.message };
  }
}

// Handle duplicates in output
function removeDuplicateObjects(detectedObjects) {
  // Group objects by their label
  const objectMap = {};
  
  detectedObjects.forEach(obj => {
    const label = obj.label.toLowerCase();
    
    // If we haven't seen this label yet, or this instance has higher confidence
    if (!objectMap[label] || obj.score > objectMap[label].score) {
      objectMap[label] = obj;
    }
  });
  
  // Convert back to array
  return Object.values(objectMap);
}

module.exports = {
  analyzeImage,
  extractDominantColors,
  removeDuplicateObjects
}; 