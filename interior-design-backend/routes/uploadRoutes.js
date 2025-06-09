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
router.post('/upload', upload.array('file'), async (req, res) => {
  try {
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

        // Generate suggestions
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
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 