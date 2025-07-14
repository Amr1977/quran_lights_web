function sortNumber(a, b) {
  return a - b;
}

function sortByX(array) {
  return array.sort(function (a, b) {
    var x = a[0];
    var y = b[0];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

function showToast(message) {
  var x = document.getElementById("snackbar");
  x.textContent = message;
  x.className = "show";
}

function hideToast() {
  var x = document.getElementById("snackbar");
  x.className = x.className.replace("show", "");
}

function readableFormat(number) {
  var result = SCORE_CURRENCY;
  number = Number(number);
  if (number >= 1000_000_000) {
    result += (number / 1000_000_000).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "B";
  } else if (number >= 1000_000) {
    result += (number / 1000_000).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "M";
  } else if (number >= 1000) {
    result += (number / 1000).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "K";
  } else {
    result += number.toFixed(0);
  }

  return result;
}

function todayStartTimeStamp() {
  var now = new Date();
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var timestamp = startOfDay / 1000;
  return timestamp;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

function get_local_storage_object(key) {
  var object = is_json_string(localStorage.getItem(myUserId + "_" + key));
  if (object[0]) {
    return object[1];
  }

  return null;
}

function set_local_storage_object(key, value) {
  var saved = JSON.stringify(value);
  localStorage.setItem(myUserId + "_" + key, saved);

  return saved;
}

function jsonfy(value){
  return JSON.stringify(value);
}

/**
 * 
 * @param {*} json_string string to be checked and parsed
 * @returns [success_boolean, result_object]
 */
function is_json_string(json_string) {
  var result;
  try {
    result = JSON.parse(json_string, null, 2);
  } catch (e) {
    console.log(e);
    return [false, {}];
  }
  return [true, result];
}

function get_humanized_period(days_count) {
  days_count = Number(days_count);
  if (days_count >= 365) {
    return (days_count / 365).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "Y";
  } else if (days_count >= 30) {
    return (days_count / 30).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "M";
  } else if (days_count >= 1) {
    return days_count.toFixed(1) + "D";
  } else {
    var hours = days_count * 24;
    if (hours > 1) {
      return (hours).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "H";
    } else {
    return (hours * 60).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "m";
    }
  }
}

/**
 * This function attepts to retrieve a local storage value, 
 * if not found it creates it with the provided initial value.
 */
function get_initial_local_object(object_name, initial_value) {
  var stored_value = get_local_storage_object(object_name);
  if (stored_value) {
    return stored_value;
  }

  set_local_storage_object(object_name, initial_value);
  return initial_value;
}

//https://stackoverflow.com/a/2117523/1356559
function generate_uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/**
   * returns timestamp in microseconds with server skew offset
   */
function get_time_stamp() {
  var millis = window.performance.timing.navigationStart + window.performance.now();
  var transactionTimeStamp = (millis + serverOffset) * 1000;
  return transactionTimeStamp;
}

function sort_transactions_by_timestamp(array) {
  return array.sort(function (a, b) {
    var x = (Number)(a.time);
    var y = (Number)(b.time);
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

function clear_reviews() {
  var reviewsNode = document.getElementById("reviews");
  while (reviewsNode.firstChild) {
    reviewsNode.removeChild(reviewsNode.firstChild);
  }
}

function clear_children(id) {
  var parent = document.getElementById(id);
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function format(number) {
  return formatter.format(number);
}

function add_prayer_times() {
  fetch('https://extreme-ip-lookup.com/json/')
      .then(res => res.json())
      .then(response => {
        var city = response.city;
        if(city) {
          city = city.toLowerCase();
        }
          document.getElementById("prayers").src = "https://timesprayer.com/widgets.php?frame=2&lang=en&name="+city+"&sound=true&avachang=true&time=0";
      })
      .catch((data, status) => {
          var city = "mecca";
          console.log('Request failed');
          console.log("Country: ", response.country, " city: ", response.city);
          document.getElementById("prayers").src = document.getElementById("prayers").src = "https://timesprayer.com/widgets.php?frame=2&lang=en&name="+city+"&sound=true&avachang=true&time=0";
      })
}

function stack_trace(){
  console.log(new Error().stack);
}

document.utils = true;

function clear_local_storage(){
  localStorage.clear();
  location.reload();
}

function add_tooltip(element, tooltip) {
  $(element).hover(function () {
    $(this).css('cursor', 'pointer').attr('title', tooltip);
  }, function () {
    $(this).css('cursor', 'auto');
  });
}

function format_readable_number(some_number){
  return String(some_number).replace(/(.)(?=(\d{3})+$)/g,'$1,')
}

// Input validation and sanitization utilities
const InputValidator = {
  // Sanitize HTML input
  sanitizeHtml: function(input) {
    if (typeof input !== 'string') return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Validate name input
  validateName: function(name) {
    if (!name || typeof name !== 'string') return false;
    const sanitized = this.sanitizeHtml(name.trim());
    return sanitized.length >= 2 && sanitized.length <= 100;
  },

  // Validate role input
  validateRole: function(role) {
    if (!role || typeof role !== 'string') return false;
    const sanitized = this.sanitizeHtml(role.trim());
    return sanitized.length >= 2 && sanitized.length <= 100;
  },

  // Validate rating input
  validateRating: function(rating) {
    const num = parseInt(rating);
    return !isNaN(num) && num >= 1 && num <= 5;
  },

  // Validate text input
  validateText: function(text) {
    if (!text || typeof text !== 'string') return false;
    const sanitized = this.sanitizeHtml(text.trim());
    return sanitized.length >= 10 && sanitized.length <= 1000;
  },

  // Validate email
  validateEmail: function(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  // Rate limiting helper
  checkRateLimit: function(key, limit = 3, windowMs = 60000) {
    const now = Date.now();
    const keyData = localStorage.getItem(`rateLimit_${key}`);
    
    if (!keyData) {
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify({
        count: 1,
        firstAttempt: now
      }));
      return true;
    }

    const data = JSON.parse(keyData);
    const timeDiff = now - data.firstAttempt;

    if (timeDiff > windowMs) {
      // Reset if window has passed
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify({
        count: 1,
        firstAttempt: now
      }));
      return true;
    }

    if (data.count >= limit) {
      return false;
    }

    // Increment count
    data.count++;
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify(data));
    return true;
  }
};

// Error handling utilities
const ErrorHandler = {
  showError: function(message, duration = 5000) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.style.cssText = `
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
      text-align: center;
      border: 1px solid #f5c6cb;
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
    `;
    errorDiv.innerHTML = `<strong>خطأ!</strong> ${message}`;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, duration);
  },

  showSuccess: function(message, duration = 5000) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.style.cssText = `
      background: #d4edda;
      color: #155724;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
      text-align: center;
      border: 1px solid #c3e6cb;
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
    `;
    successDiv.innerHTML = `<strong>نجح!</strong> ${message}`;

    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.remove();
    }, duration);
  },

  logError: function(error, context = '') {
    console.error(`[${context}] Error:`, error);
    
    // Send to error tracking service if available
    if (window.getConfig && window.getConfig('features.errorReporting')) {
      // TODO: Implement error tracking service
      console.log('Error tracking enabled but not implemented');
    }
  }
};

// Performance utilities
const PerformanceUtils = {
  // Debounce function calls
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function calls
  throttle: function(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Measure performance
  measureTime: function(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
};

// Make utilities globally available
window.InputValidator = InputValidator;
window.ErrorHandler = ErrorHandler;
window.PerformanceUtils = PerformanceUtils;