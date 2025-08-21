// Google Analytics 4 Configuration Example
// Copy this file to config.js and fill in your actual values

module.exports = {
  // Your GA4 Property ID (found in GA4 Admin > Property Settings)
  GA4_PROPERTY_ID: '502040277',
  
  // Service Account Credentials
    GOOGLE_APPLICATION_CREDENTIALS: './service-account-key.json',
  
  // Environment
  NODE_ENV: 'production',
  
  // Optional: Custom cache duration in seconds (default: 300)
  CACHE_DURATION: 300
};
