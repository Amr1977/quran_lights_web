#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read environment variables or use defaults
const config = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAEdMiadM_2s39jcHnirT1HPZnXBg3bk6k",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "quran-lights.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://quran-lights.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "quran-lights",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "quran-lights.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "35819574492"
  },

  app: {
    version: process.env.APP_VERSION || "8.6.19",
    environment: process.env.NODE_ENV || "development",
    debug: process.env.NODE_ENV !== "production"
  },

  features: {
    analytics: process.env.ENABLE_ANALYTICS !== "false",
    errorReporting: process.env.ENABLE_ERROR_REPORTING === "true",
    offlineSupport: process.env.ENABLE_OFFLINE_SUPPORT !== "false"
  }
};

// Generate the config file content
const configContent = `// Auto-generated config file - Do not edit manually
// Generated on: ${new Date().toISOString()}

window.APP_CONFIG = ${JSON.stringify(config, null, 2)};

// Helper function to get config values
window.getConfig = function(key, defaultValue = null) {
  const keys = key.split('.');
  let value = window.APP_CONFIG;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return defaultValue;
    }
  }
  
  return value;
};
`;

// Write the config file
const configPath = path.join(__dirname, 'public', 'js', 'config.js');
fs.writeFileSync(configPath, configContent);

console.log('✅ Config file generated:', configPath);
console.log('Environment:', config.app.environment);
console.log('Debug mode:', config.app.debug); 