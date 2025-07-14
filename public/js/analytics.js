// Analytics and Monitoring Utility
class Analytics {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.init();
  }

  init() {
    // Track page load
    this.trackPageView();

    // Track user interactions
    this.trackUserInteractions();

    // Track performance metrics
    this.trackPerformance();

    // Track errors
    this.trackErrors();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  trackEvent(category, action, label = null, value = null) {
    const event = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.events.push(event);
    console.log('Analytics Event:', event);

    // Send to Firebase if available
    this.sendToFirebase(event);

    // Store locally for offline sync
    this.storeLocally(event);
  }

  trackPageView() {
    this.trackEvent('page', 'view', window.location.pathname);
  }

  trackUserInteractions() {
    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.id) {
        this.trackEvent('form', 'submit', form.id);
      }
    });

    // Track button clicks
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        const text = target.textContent.trim();
        const id = target.id || target.className;
        this.trackEvent('click', 'button', `${id} - ${text}`);
      }
    });

    // Track navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        this.trackEvent('navigation', 'internal', link.href);
      }
    });
  }

  trackPerformance() {
    // Track page load performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        this.trackEvent('performance', 'page_load', 'total_time', perfData.loadEventEnd - perfData.loadEventStart);
        this.trackEvent('performance', 'dom_content_loaded', 'time', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
      }
    });

    // Track resource loading
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.trackEvent('performance', 'resource_load', entry.name, entry.duration);
        }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  }

  trackErrors() {
    // Track JavaScript errors
    window.addEventListener('error', (e) => {
      this.trackEvent('error', 'javascript', `${e.filename}:${e.lineno}:${e.colno}`, 1);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.trackEvent('error', 'promise_rejection', e.reason.toString(), 1);
    });
  }

  sendToFirebase(event) {
    if (typeof firebase !== 'undefined' && firebase.database) {
      const analyticsRef = firebase.database().ref('analytics');
      analyticsRef.push(event)
        .catch(error => {
          console.error('Failed to send analytics to Firebase:', error);
        });
    }
  }

  storeLocally(event) {
    const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    stored.push(event);

    // Keep only last 100 events
    if (stored.length > 100) {
      stored.splice(0, stored.length - 100);
    }

    localStorage.setItem('analytics_events', JSON.stringify(stored));
  }

  // Get analytics summary
  getSummary() {
    const now = Date.now();
    const sessionDuration = now - this.startTime;

    return {
      sessionId: this.sessionId,
      sessionDuration,
      eventCount: this.events.length,
      pageViews: this.events.filter(e => e.category === 'page').length,
      clicks: this.events.filter(e => e.category === 'click').length,
      errors: this.events.filter(e => e.category === 'error').length
    };
  }

  // Export analytics data
  exportData() {
    return {
      session: this.getSummary(),
      events: this.events
    };
  }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.analytics = new Analytics();
});

// Track review submissions specifically
function trackReviewSubmission(success = true) {
  if (window.analytics) {
    window.analytics.trackEvent('review', success ? 'submit_success' : 'submit_error');
  }
}

// Track dashboard usage
function trackDashboardAction(action, details = null) {
  if (window.analytics) {
    window.analytics.trackEvent('dashboard', action, details);
  }
}

// Track feature usage
function trackFeatureUsage(feature, action = 'use') {
  if (window.analytics) {
    window.analytics.trackEvent('feature', action, feature);
  }
} 