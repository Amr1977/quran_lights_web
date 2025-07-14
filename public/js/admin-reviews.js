// Admin Reviews Management
let currentReviewId = null;

document.addEventListener('DOMContentLoaded', function () {
  // Load all reviews
  loadAllReviews();

  // Set up modal event handlers
  setupModalHandlers();
});

function loadAllReviews() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    return;
  }

  const reviewsRef = firebase.database().ref('reviews');

  reviewsRef.once('value')
    .then((snapshot) => {
      const reviews = [];
      snapshot.forEach((childSnapshot) => {
        const review = childSnapshot.val();
        review.id = childSnapshot.key;
        reviews.push(review);
      });

      // Sort by date (newest first)
      reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Separate pending and approved reviews
      const pendingReviews = reviews.filter(review => !review.approved);
      const approvedReviews = reviews.filter(review => review.approved);

      // Display reviews
      displayPendingReviews(pendingReviews);
      displayApprovedReviews(approvedReviews);
    })
    .catch((error) => {
      console.error('Error loading reviews:', error);
      showError('حدث خطأ أثناء تحميل المراجعات');
    });
}

function displayPendingReviews(reviews) {
  const container = document.getElementById('pendingReviews');

  if (reviews.length === 0) {
    container.innerHTML = '<p dir="rtl" class="text-center">لا توجد مراجعات معلقة</p>';
    return;
  }

  let html = '<div class="row">';

  reviews.forEach((review, index) => {
    const stars = '⭐'.repeat(review.rating);
    const date = new Date(review.date).toLocaleDateString('ar-SA');

    html += `
            <div class="col-md-6">
                <div class="panel panel-warning">
                    <div class="panel-heading">
                        <h4 dir="rtl">${review.name} - ${review.role}</h4>
                    </div>
                    <div class="panel-body">
                        <div class="stars">${stars}</div>
                        <p dir="rtl">"${review.text}"</p>
                        <small dir="rtl">التاريخ: ${date}</small>
                        <div class="btn-group" style="margin-top: 10px;">
                            <button class="btn btn-sm btn-info" onclick="viewReviewDetails('${review.id}')">
                                <i class="fa fa-eye"></i> عرض التفاصيل
                            </button>
                            <button class="btn btn-sm btn-success" onclick="approveReview('${review.id}')">
                                <i class="fa fa-check"></i> اعتماد
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="rejectReview('${review.id}')">
                                <i class="fa fa-times"></i> رفض
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Add row break every 2 reviews
    if ((index + 1) % 2 === 0) {
      html += '</div><div class="row">';
    }
  });

  html += '</div>';
  container.innerHTML = html;
}

function displayApprovedReviews(reviews) {
  const container = document.getElementById('approvedReviews');

  if (reviews.length === 0) {
    container.innerHTML = '<p dir="rtl" class="text-center">لا توجد مراجعات معتمدة</p>';
    return;
  }

  let html = '<div class="row">';

  reviews.forEach((review, index) => {
    const stars = '⭐'.repeat(review.rating);
    const date = new Date(review.date).toLocaleDateString('ar-SA');

    html += `
            <div class="col-md-6">
                <div class="panel panel-success">
                    <div class="panel-heading">
                        <h4 dir="rtl">${review.name} - ${review.role}</h4>
                    </div>
                    <div class="panel-body">
                        <div class="stars">${stars}</div>
                        <p dir="rtl">"${review.text}"</p>
                        <small dir="rtl">التاريخ: ${date}</small>
                        <div class="btn-group" style="margin-top: 10px;">
                            <button class="btn btn-sm btn-info" onclick="viewReviewDetails('${review.id}')">
                                <i class="fa fa-eye"></i> عرض التفاصيل
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="rejectReview('${review.id}')">
                                <i class="fa fa-times"></i> حذف
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Add row break every 2 reviews
    if ((index + 1) % 2 === 0) {
      html += '</div><div class="row">';
    }
  });

  html += '</div>';
  container.innerHTML = html;
}

function setupModalHandlers() {
  // Approve review button
  document.getElementById('approveReviewBtn').addEventListener('click', function () {
    if (currentReviewId) {
      approveReview(currentReviewId);
    }
  });

  // Reject review button
  document.getElementById('rejectReviewBtn').addEventListener('click', function () {
    if (currentReviewId) {
      rejectReview(currentReviewId);
    }
  });
}

function viewReviewDetails(reviewId) {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    return;
  }

  currentReviewId = reviewId;

  const reviewRef = firebase.database().ref(`reviews/${reviewId}`);

  reviewRef.once('value')
    .then((snapshot) => {
      const review = snapshot.val();
      if (review) {
        displayReviewModal(review);
      }
    })
    .catch((error) => {
      console.error('Error loading review details:', error);
      showError('حدث خطأ أثناء تحميل تفاصيل المراجعة');
    });
}

function displayReviewModal(review) {
  const modalBody = document.getElementById('reviewModalBody');
  const stars = '⭐'.repeat(review.rating);
  const date = new Date(review.date).toLocaleDateString('ar-SA');
  const timestamp = review.timestamp ? new Date(review.timestamp).toLocaleDateString('ar-SA') : 'غير متوفر';

  modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h4 dir="rtl">معلومات المراجع</h4>
                <p><strong>الاسم:</strong> ${review.name}</p>
                <p><strong>المهنة:</strong> ${review.role}</p>
                <p><strong>التقييم:</strong> ${stars}</p>
                <p><strong>التاريخ:</strong> ${date}</p>
                <p><strong>وقت الإرسال:</strong> ${timestamp}</p>
            </div>
            <div class="col-md-6">
                <h4 dir="rtl">المراجعة</h4>
                <p dir="rtl" style="font-style: italic;">"${review.text}"</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <h4 dir="rtl">معلومات تقنية</h4>
                <p><strong>User Agent:</strong> ${review.userAgent || 'غير متوفر'}</p>
                <p><strong>IP Address:</strong> ${review.ipAddress || 'غير متوفر'}</p>
                <p><strong>الحالة:</strong> ${review.approved ? 'معتمد' : 'معلق'}</p>
            </div>
        </div>
    `;

  // Show/hide buttons based on review status
  const approveBtn = document.getElementById('approveReviewBtn');
  const rejectBtn = document.getElementById('rejectReviewBtn');

  if (review.approved) {
    approveBtn.style.display = 'none';
    rejectBtn.innerHTML = '<i class="fa fa-times"></i> حذف المراجعة';
  } else {
    approveBtn.style.display = 'inline-block';
    rejectBtn.innerHTML = '<i class="fa fa-times"></i> رفض المراجعة';
  }

  $('#reviewModal').modal('show');
}

function approveReview(reviewId) {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    return;
  }

  const reviewRef = firebase.database().ref(`reviews/${reviewId}`);

  reviewRef.update({ approved: true })
    .then(() => {
      showSuccess('تم اعتماد المراجعة بنجاح');
      $('#reviewModal').modal('hide');
      loadAllReviews(); // Reload the lists
    })
    .catch((error) => {
      console.error('Error approving review:', error);
      showError('حدث خطأ أثناء اعتماد المراجعة');
    });
}

function rejectReview(reviewId) {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    return;
  }

  if (confirm('هل أنت متأكد من حذف هذه المراجعة؟')) {
    const reviewRef = firebase.database().ref(`reviews/${reviewId}`);

    reviewRef.remove()
      .then(() => {
        showSuccess('تم حذف المراجعة بنجاح');
        $('#reviewModal').modal('hide');
        loadAllReviews(); // Reload the lists
      })
      .catch((error) => {
        console.error('Error rejecting review:', error);
        showError('حدث خطأ أثناء حذف المراجعة');
      });
  }
}

function showSuccess(message) {
  // Create success alert
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success alert-dismissible';
  alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
  alertDiv.innerHTML = `
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>نجح!</strong> ${message}
    `;

  document.body.appendChild(alertDiv);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 3000);
}

function showError(message) {
  // Create error alert
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-danger alert-dismissible';
  alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
  alertDiv.innerHTML = `
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>خطأ!</strong> ${message}
    `;

  document.body.appendChild(alertDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 5000);
} 