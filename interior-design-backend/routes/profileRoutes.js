const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const PROFILE_PATH = path.join(__dirname, '../data/userProfile.json');

// GET user profile/preferences
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(PROFILE_PATH)) {
      return res.json({});
    }
    const data = fs.readFileSync(PROFILE_PATH, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// POST user profile/preferences
router.post('/', (req, res) => {
  try {
    fs.writeFileSync(PROFILE_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

module.exports = router; 