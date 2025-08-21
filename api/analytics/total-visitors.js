// Google Analytics 4 Data API endpoint for fetching total visitors
// This requires setting up a service account and enabling the GA4 Data API

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Accept, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get GA4 property ID from query parameters or environment
    const { propertyId } = req.query;
    const ga4PropertyId = propertyId || process.env.GA4_PROPERTY_ID;
    
    if (!ga4PropertyId) {
      return res.status(400).json({ 
        error: 'GA4 Property ID is required. Set GA4_PROPERTY_ID environment variable or pass propertyId in query.' 
      });
    }

    // Import the GA4 Data API client
    const { BetaAnalyticsDataClient } = require('@google-analytics/data');
    
    // Initialize the client with service account credentials
    let analyticsDataClient;
    if (process.env.GOOGLE_CREDENTIALS) {
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
      });
    } else {
      analyticsDataClient = new BetaAnalyticsDataClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account-key.json'
      });
    }
    
    // Fetch total users from GA4 - simplified query structure
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${ga4PropertyId}`,
      dateRanges: [
        {
          startDate: '2020-01-01', // Adjust start date as needed
          endDate: 'today',
        },
      ],
      metrics: [
        {
          name: 'totalUsers',
        },
        {
          name: 'activeUsers',
        },
        {
          name: 'screenPageViews',
        }
      ]
      // Removed problematic dimensions and orderBy clauses
    });
    
    // Extract the data
    let totalUsers = 0;
    let activeUsers = 0;
    let totalPageViews = 0;
    
    if (response.rows && response.rows.length > 0) {
      const row = response.rows[0];
      totalUsers = parseInt(row.metricValues[0].value) || 0;
      activeUsers = parseInt(row.metricValues[1].value) || 0;
      totalPageViews = parseInt(row.metricValues[2].value) || 0;
    }
    
    // Return the data with cache headers for performance
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.status(200).json({
      totalUsers,
      activeUsers,
      totalPageViews,
      lastUpdated: new Date().toISOString(),
      propertyId: ga4PropertyId
    });
    
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    
    // Return appropriate error responses
    if (error.code === 'PERMISSION_DENIED') {
      return res.status(403).json({ 
        error: 'Access denied. Check service account permissions and GA4 property access.' 
      });
    }
    
    if (error.code === 'INVALID_ARGUMENT') {
      return res.status(400).json({ 
        error: 'Invalid property ID or parameters.',
        details: error.details || error.message
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to fetch analytics data',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
