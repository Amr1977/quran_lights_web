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