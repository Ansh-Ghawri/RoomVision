const path = require('path');
const { generateComplementaryColors } = require('../utils/colorUtils');
const { extractDominantColors } = require('./imageAnalysisService');

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
    suggestionText += getSuggestionForObject(primaryObject.label);

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

// Get specific suggestion text based on detected object
function getSuggestionForObject(objectLabel) {
  const label = objectLabel.toLowerCase();
  
  if (label === 'sofa' || label === 'couch') {
    return ' Consider adding a matching coffee table in a modern minimalist style to complement the couch.';
  } else if (label === 'chair') {
    return ' Consider adding a matching desk in a Scandinavian style to pair with the chair.';
  } else if (label === 'bed') {
    return ' Consider adding a matching decorative piece like a vase or artwork to enhance the room\'s aesthetic.';
  } else {
    return ' Consider adding a decorative piece like a vase or artwork to enhance the room\'s aesthetic.';
  }
}

module.exports = {
  generateSuggestions
}; 