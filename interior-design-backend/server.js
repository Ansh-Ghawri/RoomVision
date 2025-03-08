require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS to allow requests from your frontend (localhost:5173)
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.static(path.join(__dirname, 'dist')));

// Define upload directory
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Hugging Face API configuration
const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/detr-resnet-50';

async function extractDominantColors(filePath) {
  try {
    // Get image stats including dominant color
    const { dominant } = await sharp(filePath)
      .stats();
      
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

// Helper function to convert RGB array to hex
function rgbToHex(rgb) {
  return '#' + rgb.map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
// Function to generate complementary, analogous, and triadic colors
function generateComplementaryColors(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate complementary color (180° on the color wheel)
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    
    // Convert back to hex
    const complementary = '#' + 
      ((1 << 24) + (compR << 16) + (compG << 8) + compB)
      .toString(16).slice(1);
    
    // Calculate analogous colors (±30° on the color wheel)
    const hsl = rgbToHsl(r, g, b);
    const analogous1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
    const analogous2 = hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l);
    
    // Calculate triadic colors (120° apart on the color wheel)
    const triadic1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
    const triadic2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);
    
    // Return a flat array of all colors
    return [hexColor, complementary, analogous1, analogous2, triadic1, triadic2];
}
  
  // Helper function to convert RGB to HSL
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h *= 60;
    }
    
    return { h, s, l };
  }
  
  // Helper function to convert HSL to Hex
  function hslToHex(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, (h / 360) + 1/3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, (h / 360) - 1/3);
    }
    
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

// Function to analyze image with Hugging Face
async function analyzeImage(filePath) {
    try {
      // Read file as binary data instead of using FormData
      const imageBuffer = fs.readFileSync(filePath);
      
      const response = await axios.post(HF_API_URL, imageBuffer, {
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/octet-stream',
        },
      });
      
      console.log('Hugging Face API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Hugging Face API Error Details:', error.message);
      return { error: 'Failed to analyze image', details: error.message };
    }
  }
//handling duplicates in output
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

// Generate design suggestions based on detected objects
async function generateSuggestions(detectedObjects, filePath) {
    const suggestions = [];
    const commonObjects = ['chair', 'table', 'sofa', 'couch', 'lamp', 'bed', 'mirror', 'rug'];
  
    // Extract dominant colors from the image using Sharp
    const dominantColors = await extractDominantColors(filePath);
  
    // Filter and collect all detected objects that meet the confidence threshold
    const validObjects = detectedObjects
      .filter(obj => commonObjects.includes(obj.label.toLowerCase()) && obj.score > 0.5)
      .map(obj => ({ label: obj.label, score: obj.score }));
  
    if (validObjects.length === 0) {
      suggestions.push({
        filename: path.basename(filePath),
        detectedObjects: [],
        dominantColors: dominantColors.error ? null : dominantColors,
        suggestion: 'No specific furniture detected. Try uploading a room image with furniture!',
      });
    } else {
      // Generate a single recommendation based on the most prominent object
      const primaryObject = validObjects.reduce((max, obj) => 
        max.score > obj.score ? max : obj, validObjects[0]);
      let suggestionText = `Detected ${validObjects.length} furniture items including ${primaryObject.label}.`;
  
      // Add a recommendation based on the primary object
      if (primaryObject.label.toLowerCase() === 'sofa' || primaryObject.label.toLowerCase() === 'couch') {
        suggestionText += ' Consider adding a matching coffee table in a modern minimalist style to complement the couch.';
      } else if (primaryObject.label.toLowerCase() === 'chair') {
        suggestionText += ' Consider adding a matching desk in a Scandinavian style to pair with the chair.';
      } else if (primaryObject.label.toLowerCase() === 'bed') {
        suggestionText += ' Consider adding a matching decorative piece like a vase or artwork to enhance the room\'s aesthetic.';
      } else {
        suggestionText += ' Consider adding a decorative piece like a vase or artwork to enhance the room\'s aesthetic.';
      }
  
      suggestions.push({
        filename: path.basename(filePath),
        detectedObjects: validObjects,
        dominantColors: dominantColors.error ? null : dominantColors,
        colorPalette: generateComplementaryColors(dominantColors.dominant),
        suggestion: suggestionText,
      });
    }
  
    return suggestions;
  }
  
  // Update the /upload endpoint to handle the new suggestion structure
  app.post('/upload', upload.array('file'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
  
    const fileUrls = [];
    const designSuggestions = [];
  
    for (const file of req.files) {
      const filePath = path.join(uploadDir, file.filename);
      const fileUrl = `http://localhost:5000/uploads/${file.filename}`;
      fileUrls.push(fileUrl);
  
      // Analyze with Hugging Face
      const analysis = await analyzeImage(filePath);
      if (analysis.error) {
        designSuggestions.push({ filename: file.filename, error: analysis.error });
      } else {
        const detectedObjects = analysis.filter(item => item.score > 0.5);
        const uniqueObjects = removeDuplicateObjects(detectedObjects);
  
        // Generate suggestions (now returns one suggestion per image)
        const generatedSuggestions = await generateSuggestions(uniqueObjects, filePath);
        designSuggestions.push(...generatedSuggestions);
      }
    }
  
    res.json({
      message: 'Files uploaded and analyzed successfully',
      filenames: req.files.map(file => file.filename),
      urls: fileUrls,
      suggestions: designSuggestions,
    });
  });

// API endpoint for file upload and analysis
app.post('/upload', upload.array('file'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
  
    const fileUrls = [];
    const designSuggestions = [];
  
    for (const file of req.files) {
      const filePath = path.join(uploadDir, file.filename);
      const fileUrl = `http://localhost:5000/uploads/${file.filename}`;
      fileUrls.push(fileUrl);
  
      // Analyze with Hugging Face
      const analysis = await analyzeImage(filePath);
      if (analysis.error) {
        designSuggestions.push({ filename: file.filename, error: analysis.error });
      } else {
        const detectedObjects = analysis.filter(item => item.score > 0.5); // Confidence threshold
        const uniqueObjects = removeDuplicateObjects(detectedObjects);
  
        // Generate suggestions and flatten the structure
        const generatedSuggestions = await generateSuggestions(uniqueObjects, filePath);
        generatedSuggestions.forEach(suggestion => {
          designSuggestions.push({
            filename: file.filename,
            detectedObjects: uniqueObjects, // Use unique objects
            dominantColors: suggestion.dominantColors,
            colorPalette: suggestion.colorPalette,
            suggestion: suggestion.suggestion,
          });
        });
  
        // If no suggestions were generated (e.g., no common objects detected)
        if (generatedSuggestions.length === 0) {
          designSuggestions.push({
            filename: file.filename,
            detectedObjects: uniqueObjects,
            suggestion: 'No specific furniture detected. Try uploading a room image with furniture!',
            dominantColors: generatedSuggestions[0]?.dominantColors,
          });
        }
      }
    }
  
    res.json({
      message: 'Files uploaded and analyzed successfully',
      filenames: req.files.map(file => file.filename),
      urls: fileUrls,
      suggestions: designSuggestions,
    });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});