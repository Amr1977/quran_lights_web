// Firebase config loader
// Selects config based on window.FIREBASE_ENV ("prod", "test", "staging", "dev")
// Defaults to prod. For manual recovery, edit the import below.

let configModule;
const env = (window.FIREBASE_ENV || 'prod').toLowerCase();

switch (env) {
  case 'test':
    configModule = require('./firebase.config.test.js');
    break;
  case 'staging':
    configModule = require('./firebase.config.staging.js');
    break;
  case 'dev':
    configModule = require('./firebase.config.dev.js');
    break;
  case 'prod':
  default:
    configModule = require('./firebase.config.prod.js');
    break;
}

export const firebaseConfig = configModule.firebaseConfig; 