require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS to allow requests from your frontend 
app.use(cors({ origin: '*' }));

app.use(express.static(path.join(__dirname, 'dist')));

// Routes
app.use('/', uploadRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});