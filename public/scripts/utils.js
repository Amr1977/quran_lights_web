function sortNumber(a, b) {
    return a - b;
}

function sortByX(array) {
    return array.sort(function(a, b) {
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
    if (number >= 1000000000) {
      return (number / 1000000000).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "G";
    } else if (number >= 1000000) {
      return (number / 1000000).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(NUMBER_OF_DECIMAL_DIGITS) + "K";
    } else {
      return number;
    }
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
    return array.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  function getLocalStorageObject(key) {
    var object = is_json_string(localStorage.getItem(myUserId + "_" + key));
    if (object[0]) {
      return object[1];
    } 
    
    return null;
  }

  function setLocalStorageObject(key, value) {
    var saved = JSON.stringify(value);
    localStorage.setItem(myUserId + "_" + key, saved);

    return saved;
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