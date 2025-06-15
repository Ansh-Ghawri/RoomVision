const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeImage, removeDuplicateObjects } = require('../services/imageAnalysisService');
const { generateSuggestions } = require('../services/suggestionService');

const router = express.Router();

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

// API endpoint for file upload and analysis
router.post('/', upload.array('file'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const fileUrls = [];
    const designSuggestions = [];
    const warnings = [];

    for (const file of req.files) {
      const filePath = path.join(uploadDir, file.filename);
      const fileUrl = `http://localhost:5000/uploads/${file.filename}`;
      fileUrls.push(fileUrl);

      console.log(`Processing file: ${file.filename}`);

      // Analyze with Hugging Face
      const analysis = await analyzeImage(filePath);
      
      if (analysis.error) {
        console.log(`Analysis error for ${file.filename}:`, analysis.error);
        
        // Handle different types of errors
        if (analysis.fallback) {
          // We have some fallback data (colors)
          warnings.push({
            filename: file.filename,
            message: analysis.error,
            suggestion: 'Color-based suggestions provided as fallback'
          });
          
          // Generate suggestions based on fallback data
          const fallbackSuggestions = await generateSuggestions(analysis.objects || [], filePath, analysis.colors);
          designSuggestions.push(...fallbackSuggestions);
        } else {
          // Complete failure
          warnings.push({
            filename: file.filename,
            message: analysis.error,
            suggestion: analysis.suggestion || 'Please try uploading the image again later'
          });
          
          // Provide basic generic suggestions when analysis fails
          const genericSuggestions = [
            {
              filename: file.filename,
              type: 'color',
              suggestion: 'Consider adding warm colors like beige, cream, or soft pastels to create a welcoming atmosphere',
              confidence: 'low'
            },
            {
              filename: file.filename,
              type: 'lighting',
              suggestion: 'Good lighting is essential - consider adding table lamps or floor lamps for ambient lighting',
              confidence: 'low'
            },
            {
              filename: file.filename,
              type: 'space',
              suggestion: 'Ensure furniture placement allows for easy movement and conversation flow',
              confidence: 'low'
            }
          ];
          designSuggestions.push(...genericSuggestions);
        }
      } else {
        // Successful analysis
        console.log(`Successful analysis for ${file.filename}`);
        const detectedObjects = analysis.filter(item => item.score > 0.5);
        const uniqueObjects = removeDuplicateObjects(detectedObjects);

        // Generate suggestions
        const generatedSuggestions = await generateSuggestions(uniqueObjects, filePath);
        designSuggestions.push(...generatedSuggestions);
      }
    }

    const responseData = {
      message: 'Files uploaded and processed successfully',
      filenames: req.files.map(file => file.filename),
      urls: fileUrls,
      suggestions: designSuggestions,
    };

    // Add warnings if any occurred
    if (warnings.length > 0) {
      responseData.warnings = warnings;
      responseData.message = 'Files uploaded with some processing limitations';
    }

    res.json(responseData);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      suggestion: 'Please try again. If the problem persists, the AI service may be temporarily unavailable.'
    });
  }
});

module.exports = router; 