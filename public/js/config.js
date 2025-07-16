// Auto-generated config file - Do not edit manually
// Generated on: 2025-07-14T00:09:47.179Z

window.APP_CONFIG = {
  "firebase": {
    "apiKey": "AIzaSyAEdMiadM_2s39jcHnirT1HPZnXBg3bk6k",
    "authDomain": "quran-lights.firebaseapp.com",
    "databaseURL": "https://quran-lights.firebaseio.com",
    "projectId": "quran-lights",
    "storageBucket": "quran-lights.appspot.com",
    "messagingSenderId": "35819574492"
  },
  "app": {
    "version": "8.6.19",
    "environment": "development",
    "debug": true
  },
  "features": {
    "analytics": true,
    "errorReporting": false,
    "offlineSupport": true
  }
};

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

// Firebase initialization is now handled in js/firebase-init.js (modular, multi-environment)
