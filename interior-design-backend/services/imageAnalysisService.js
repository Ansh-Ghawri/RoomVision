const fs = require('fs');
const axios = require('axios');
const mime = require('mime-types');
const sharp = require('sharp');
const { rgbToHex } = require('../utils/colorUtils');

// Hugging Face API configuration
const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/detr-resnet-50';

// Function to analyze image with Hugging Face
async function analyzeImage(filePath) {
  try {
    // Read file as binary data
    const imageBuffer = fs.readFileSync(filePath);
    
    const contentType = mime.lookup(filePath) || 'image/jpeg';
    
    const response = await axios.post(HF_API_URL, imageBuffer, {
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': contentType,
      },
    });
    
    console.log('Hugging Face API Response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Hugging Face API Error Data:', error.response.data);
    }
    console.error('Hugging Face API Error Details:', error.message);
    return { error: 'Failed to analyze image', details: error.message };
  }
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