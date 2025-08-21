const express = require('express');
const path = require('path');

// Use real GA4 API
const handler = require('./analytics/total-visitors').handler;

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Analytics endpoint
app.get('/api/analytics/total-visitors', async (req, res) => {
  try {
    // Mock the Next.js req/res objects
    const mockReq = {
      method: 'GET',
      query: req.query
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          res.status(code).json(data);
        }
      }),
      setHeader: (name, value) => {
        res.setHeader(name, value);
      },
      json: (data) => {
        res.json(data);
      }
    };
    
    await handler(mockReq, mockRes);
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    api: 'real-ga4',
    note: 'Using real GA4 data'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'GA4 Analytics API Server',
    api: 'real-ga4',
    endpoints: {
      '/api/analytics/total-visitors': 'Get visitor statistics',
      '/health': 'Health check'
    },
    usage: 'Add ?propertyId=YOUR_GA4_ID to the analytics endpoint',
    note: 'Using real GA4 API'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GA4 Analytics API Server running on port ${PORT}`);
  console.log(`📊 Analytics endpoint: http://localhost:${PORT}/api/analytics/total-visitors`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Add ?propertyId=YOUR_GA4_ID to test the analytics endpoint`);
  console.log(`🔧 API Mode: REAL GA4`);
  console.log(`🌐 CORS enabled for cross-origin requests`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
