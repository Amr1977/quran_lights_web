// Firebase initialization
// Imports config from firebase.config.js and guards against duplicate initialization
// For crash recovery: edit config import or re-run this file

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { firebaseConfig } from "./firebase.config.js";

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics may not be available in all environments
  analytics = null;
}

export { app, analytics }; 