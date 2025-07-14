# Quran Lights Deployment Guide

## Current Setup: Firebase Hosting

### Quick Start
```bash
# Install dependencies
npm install

# Build for development
npm run build

# Build for production
npm run build:prod

# Deploy to Firebase
npm run deploy
```

## Environment Variables

Create a `.env` file for production:
```bash
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=quran-lights.firebaseapp.com
FIREBASE_DATABASE_URL=https://quran-lights.firebaseio.com
FIREBASE_PROJECT_ID=quran-lights
FIREBASE_STORAGE_BUCKET=quran-lights.appspot.com
FIREBASE_MESSAGING_SENDER_ID=35819574492

# App Configuration
NODE_ENV=production
APP_VERSION=8.6.19
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=false
ENABLE_OFFLINE_SUPPORT=true
```

## Alternative Hosting Options

### Option 1: Vercel (Recommended for Modern Apps)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Benefits:**
- Automatic HTTPS
- Global CDN
- Serverless functions
- Easy environment variable management
- Automatic deployments from Git

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Benefits:**
- Free tier
- Easy form handling
- Built-in analytics
- A/B testing

### Option 3: GitHub Pages
```bash
# Add to package.json
"scripts": {
  "deploy:gh": "npm run build:prod && gh-pages -d public"
}
```

### Option 4: Node.js Backend + Static Hosting

#### Backend (Express.js)
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));

// API routes for sensitive operations
app.get('/api/config', (req, res) => {
  res.json({
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY
    }
  });
});

app.listen(process.env.PORT || 3000);
```

#### Frontend Changes
```javascript
// Load config from API instead of client-side
fetch('/api/config')
  .then(res => res.json())
  .then(config => {
    window.APP_CONFIG = config;
    initializeApp();
  });
```

## Security Improvements

### 1. Move API Keys Server-Side
- Create a Node.js API for sensitive operations
- Keep Firebase hosting for static files
- Use environment variables for API keys

### 2. Add Firebase Security Rules
```javascript
// firebase.rules.json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 3. Implement Rate Limiting
```javascript
// Add to Node.js backend
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Performance Optimization

### 1. Bundle JavaScript Files
```bash
# Install bundler
npm install --save-dev webpack webpack-cli

# Create webpack.config.js
# Bundle all scripts into single file
```

### 2. Minify Assets
```bash
# Install minifiers
npm install --save-dev terser cssnano html-minifier

# Add to build script
```

### 3. Optimize Images
```bash
# Install image optimizer
npm install --save-dev imagemin imagemin-webp

# Convert images to WebP format
```

## Monitoring and Analytics

### 1. Error Tracking
```javascript
// Add to config.js
window.APP_CONFIG.features.errorReporting = true;

// Implement error tracking
window.addEventListener('error', (e) => {
  if (window.getConfig('features.errorReporting')) {
    // Send to error tracking service
  }
});
```

### 2. Performance Monitoring
```javascript
// Add performance monitoring
if (window.getConfig('features.analytics')) {
  // Track page load times
  // Monitor user interactions
}
```

## Migration Checklist

- [ ] Set up environment variables
- [ ] Create build process
- [ ] Add security rules
- [ ] Implement error handling
- [ ] Add performance monitoring
- [ ] Test deployment process
- [ ] Set up CI/CD pipeline
- [ ] Document deployment process 