require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const profileRoutes = require('./routes/profileRoutes');
const axios = require('axios');

// Validate environment variables
function validateEnvironment() {
  const requiredVars = ['HF_API_TOKEN'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please create a .env file with the following variables:');
    console.error('   HF_API_TOKEN=your_hugging_face_token_here');
    console.error('\n🔗 Get your Hugging Face token at: https://huggingface.co/settings/tokens');
    console.error('\n⚠️  Server will start but image analysis will fail without proper configuration.\n');
  } else {
    console.log('✅ Environment variables validated successfully');
  }
}

validateEnvironment();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS to allow requests from your frontend 
app.use(cors({ origin: '*' }));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      backend: 'ok'
    }
  };

  // Check if Hugging Face API token is configured
  if (process.env.HF_API_TOKEN) {
    health.services.huggingface = 'configured';
  } else {
    health.services.huggingface = 'no_token';
    health.status = 'degraded';
    health.message = 'Hugging Face API token not configured. Image analysis will not work.';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Routes
app.use('/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});