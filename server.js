// Updated server.js
// Replace your current server.js with this version

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const plaidRoutes = require('./src/routes/plaid');
const comprehensionRoutes = require('./src/routes/comprehension');
const { startCronJobs } = require('./src/jobs/cron');
const supabase = require('./src/config/supabase');
const verifyJWT = require('./src/middleware/auth');
const { validate } = require('./src/middleware/validate');
const { levelPlacementSchema } = require('./src/config/schemas');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security headers ────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",             // needed for inline React in the HTML
        "'unsafe-eval'",               // needed for Babel standalone
        "https://unpkg.com",           // React, ReactDOM, Babel
        "https://cdn.jsdelivr.net",    // Supabase SDK
        "https://cdn.onesignal.com",   // OneSignal SDK
        "https://cdn.plaid.com"        // Plaid Link
      ],
      connectSrc: [
        "'self'",
        "https://llqguizfjmgpnbkruxun.supabase.co",  // Supabase API
        "https://cdn.plaid.com",
        "https://*.plaid.com",
        "https://onesignal.com",
        "https://*.onesignal.com"
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],         // inline styles in HTML
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      frameSrc: ["https://cdn.plaid.com"]              // Plaid Link iframe
    }
  }
}));

// ─── CORS ────────────────────────────────────────────────────────────────────
// In production, replace the origin list with your actual domain(s).
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3001', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin requests (origin is undefined) and allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ─── Rate limiting ───────────────────────────────────────────────────────────
// Global: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Stricter limit for AI endpoints (they cost money per call)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI request limit reached. Please try again later.' }
});

// Strict limit for auth-adjacent endpoints (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts. Please try again later.' }
});

app.use('/api/', globalLimiter);
app.use('/api/plaid/ai/', aiLimiter);
app.use('/api/comprehension/', aiLimiter);
app.use('/api/ai/', aiLimiter);

// ─── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ─── Serve frontend ──────────────────────────────────────────────────────────
// In production, serve the Vite-built React app from client/dist.
// In development, run `npm run dev` inside client/ (Vite dev server on port 5173).
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Routes
app.use('/api/plaid', plaidRoutes);
app.use('/api/comprehension', comprehensionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    message: 'Migo Backend is running! 🚀',
    features: {
      plaid: 'Connected',
      notifications: 'Enabled',
      cronJobs: 'Active'
    }
  });
});

// Serve React app for all non-API routes (SPA fallback)
app.get('/{*splat}', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/') || req.path === '/health') return next();
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// AI Level Placement Route
app.post('/api/ai/level-placement', verifyJWT, validate(levelPlacementSchema), async (req, res) => {
  try {
    const userId = req.userId;
    const { diagnosticAnswers } = req.body;
    
    // Fetch user's Plaid data
    const plaidData = await fetchUserPlaidData(userId);
    
    // Get AI recommendation
    const placement = await determineUserLevel(diagnosticAnswers, plaidData, userId);
    
    // Save to database
    await supabase
      .from('users')
      .update({
        current_level: placement.recommendedLevel,
        diagnostic_completed: true,
        can_skip_level_3: placement.canSkipLevel3
      })
      .eq('id', userId);
    
    res.json(placement);
    
  } catch (error) {
    console.error('Placement error:', error);
    res.status(500).json({ error: 'Failed to determine level' });
  }
});

// Helper function to fetch Plaid data
async function fetchUserPlaidData(userId) {
  // Get user's Plaid access token
  const { data: user, error } = await supabase
    .from('users')
    .select('plaid_access_token')
    .eq('id', userId)
    .single();
  
  if (error || !user || !user.plaid_access_token) {
    throw new Error('No Plaid data available for user');
  }
  
  // You'll need to import your Plaid client here
  // For now, we'll return mock data - you can connect real Plaid later
  return {
    checking: 500,
    savings: 200,
    monthlyIncome: 2000,
    monthlyExpenses: 1800,
    monthlySavings: 200,
    debts: [],
    overdrafts: []
  };
}


// Start server
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Migo Backend Started');
  console.log(`✅ Server: http://localhost:${PORT}`);
  console.log(`✅ Plaid: ${process.env.PLAID_ENV} mode`);
  console.log(`✅ OneSignal: ${process.env.ONESIGNAL_APP_ID ? 'Connected' : 'Not configured'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Start automated notification jobs
  if (process.env.ONESIGNAL_APP_ID) {
    startCronJobs();
    console.log('⏰ Automated notifications: ACTIVE');
  } else {
    console.log('⚠️  OneSignal not configured - notifications disabled');
    console.log('   Add ONESIGNAL keys to .env to enable');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});