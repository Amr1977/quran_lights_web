// Review Form Handler with Firebase Integration
document.addEventListener('DOMContentLoaded', function () {
  const reviewForm = document.getElementById('reviewForm');

  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const name = document.getElementById('reviewerName').value;
      const role = document.getElementById('reviewerRole').value;
      const rating = document.getElementById('reviewRating').value;
      const text = document.getElementById('reviewText').value;

      // Enhanced validation using InputValidator
      if (!window.InputValidator) {
        ErrorHandler.showError('خطأ في تحميل أدوات التحقق. يرجى تحديث الصفحة.');
        return;
      }

      // Validate each field
      if (!InputValidator.validateName(name)) {
        ErrorHandler.showError('يرجى إدخال اسم صحيح (2-100 حرف)');
        return;
      }

      if (!InputValidator.validateRole(role)) {
        ErrorHandler.showError('يرجى إدخال مهنة صحيحة (2-100 حرف)');
        return;
      }

      if (!InputValidator.validateRating(rating)) {
        ErrorHandler.showError('يرجى اختيار تقييم صحيح (1-5 نجوم)');
        return;
      }

      if (!InputValidator.validateText(text)) {
        ErrorHandler.showError('يرجى كتابة مراجعة مناسبة (10-1000 حرف)');
        return;
      }

      // Rate limiting check
      const clientId = getClientId();
      if (!InputValidator.checkRateLimit(clientId, 3, 60000)) {
        ErrorHandler.showError('يرجى الانتظار قبل إرسال مراجعة أخرى (حد أقصى 3 مراجعات في الساعة)');
        return;
      }

      // Create review object with sanitized data
      const review = {
        name: InputValidator.sanitizeHtml(name.trim()),
        role: InputValidator.sanitizeHtml(role.trim()),
        rating: parseInt(rating),
        text: InputValidator.sanitizeHtml(text.trim()),
        date: new Date().toISOString(),
        approved: false, // Reviews need approval before showing
        userAgent: navigator.userAgent,
        ipAddress: clientId, // Use client ID as IP proxy
        timestamp: typeof firebase !== 'undefined' ? firebase.database.ServerValue.TIMESTAMP : Date.now()
      };

      // Submit review to Firebase
      submitReviewToFirebase(review);
    });
  }

  // Load approved reviews on page load
  loadApprovedReviews();
});

// Generate a unique client ID for rate limiting
function getClientId() {
  let clientId = localStorage.getItem('clientId');
  if (!clientId) {
    clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('clientId', clientId);
  }
  return clientId;
}

function submitReviewToFirebase(review) {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        ErrorHandler.logError('Firebase not loaded', 'submitReviewToFirebase');
        ErrorHandler.showError('خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        return;
    }
    
    // Check if Firebase is initialized
    if (!firebase.apps || !firebase.apps.length) {
        ErrorHandler.logError('Firebase not initialized', 'submitReviewToFirebase');
        ErrorHandler.showError('خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        return;
    }

  // Show loading state
  showReviewLoading();

  // Get reference to reviews collection
  const reviewsRef = firebase.database().ref('reviews');

  // Add review to Firebase
  reviewsRef.push(review)
          .then(() => {
        console.log('Review submitted successfully:', review);
        ErrorHandler.showSuccess('تم إرسال مراجعتك بنجاح! سنقوم بمراجعتها وإضافتها قريباً.');
        document.getElementById('reviewForm').reset();
        hideReviewLoading();
        
        // Track successful review submission
        if (window.trackReviewSubmission) {
          trackReviewSubmission(true);
        }
      })
    .catch((error) => {
      ErrorHandler.logError(error, 'submitReviewToFirebase');
      ErrorHandler.showError('حدث خطأ أثناء إرسال المراجعة. يرجى المحاولة مرة أخرى.');
      hideReviewLoading();
      
      // Track failed review submission
      if (window.trackReviewSubmission) {
        trackReviewSubmission(false);
      }
    });
}

function loadApprovedReviews() {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.warn('Firebase not loaded - cannot load reviews');
        return;
    }
    
    // Check if Firebase is initialized
    if (!firebase.apps || !firebase.apps.length) {
        console.warn('Firebase not initialized - cannot load reviews');
        return;
    }

  // Get reference to approved reviews
  const approvedReviewsRef = firebase.database().ref('reviews').orderByChild('approved').equalTo(true);

  approvedReviewsRef.once('value')
    .then((snapshot) => {
      const reviews = [];
      snapshot.forEach((childSnapshot) => {
        const review = childSnapshot.val();
        review.id = childSnapshot.key;
        reviews.push(review);
      });

      // Sort by date (newest first)
      reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Display reviews
      displayReviewsFromFirebase(reviews);
    })
    .catch((error) => {
      console.error('Error loading reviews:', error);
    });
}

function displayReviewsFromFirebase(reviews) {
  const testimonialsContainer = document.querySelector('#testimonials .row:nth-child(2)');

  if (!testimonialsContainer) return;

  // Clear existing dynamic reviews (keep the static ones)
  const existingDynamicReviews = testimonialsContainer.querySelectorAll('.col-md-4:not(:nth-child(-n+3))');
  existingDynamicReviews.forEach(review => review.remove());

  // Add new reviews
  reviews.forEach((review, index) => {
    const reviewCard = createReviewCard(review);
    reviewCard.style.animationDelay = `${1.0 + (index * 0.2)}s`;
    testimonialsContainer.appendChild(reviewCard);
  });
}

function showReviewLoading() {
  const submitButton = document.querySelector('#reviewForm button[type="submit"]');
  const originalText = submitButton.innerHTML;

  submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري الإرسال...';
  submitButton.disabled = true;

  // Store original text for later restoration
  submitButton.dataset.originalText = originalText;
}

function hideReviewLoading() {
  const submitButton = document.querySelector('#reviewForm button[type="submit"]');
  submitButton.innerHTML = submitButton.dataset.originalText || 'إرسال المراجعة';
  submitButton.disabled = false;
}

function showReviewSuccess() {
  hideReviewLoading();

  // Create success message
  const successDiv = document.createElement('div');
  successDiv.className = 'alert alert-success';
  successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 5px;
        margin-top: 15px;
        text-align: center;
        border: 1px solid #c3e6cb;
    `;
  successDiv.innerHTML = `
        <strong>شكراً لك!</strong> تم إرسال مراجعتك بنجاح. 
        سنقوم بمراجعتها وإضافتها إلى صفحة آراء المستخدمين قريباً.
    `;

  // Insert after form
  const form = document.getElementById('reviewForm');
  form.parentNode.insertBefore(successDiv, form.nextSibling);

  // Remove message after 5 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

function showReviewError(message) {
  hideReviewLoading();

  // Create error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-danger';
  errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 5px;
        margin-top: 15px;
        text-align: center;
        border: 1px solid #f5c6cb;
    `;
  errorDiv.innerHTML = `<strong>خطأ!</strong> ${message}`;

  // Insert after form
  const form = document.getElementById('reviewForm');
  form.parentNode.insertBefore(errorDiv, form.nextSibling);

  // Remove message after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function createReviewCard(review) {
  const col = document.createElement('div');
  col.className = 'col-md-4 wow fadeInUp';
  col.style.animationDelay = '0.8s';

  const stars = '⭐'.repeat(review.rating);

  col.innerHTML = `
        <div class="testimonial-card">
            <div class="testimonial-content">
                <div class="stars">
                    ${stars}
                </div>
                <p dir="rtl">"${review.text}"</p>
                <div class="testimonial-author">
                    <h4>${review.name}</h4>
                    <span>${review.role}</span>
                </div>
            </div>
        </div>
    `;

  return col;
}

// Admin functions for managing reviews
function approveReview(reviewId) {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    return;
  }

  const reviewRef = firebase.database().ref(`reviews/${reviewId}`);
  return reviewRef.update({ approved: true });
}

function rejectReview(reviewId) {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    return;
  }

  const reviewRef = firebase.database().ref(`reviews/${reviewId}`);
  return reviewRef.remove();
}

function getAllReviews() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    return Promise.reject('Firebase not loaded');
  }

  const reviewsRef = firebase.database().ref('reviews');
  return reviewsRef.once('value').then(snapshot => {
    const reviews = [];
    snapshot.forEach(childSnapshot => {
      const review = childSnapshot.val();
      review.id = childSnapshot.key;
      reviews.push(review);
    });
    return reviews;
  });
}

// Export functions for admin use
window.ReviewManager = {
  approveReview,
  rejectReview,
  getAllReviews,
  loadApprovedReviews
}; 