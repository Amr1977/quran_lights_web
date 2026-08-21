/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]

  if (!(document.utils && document.constants && document.suras_data && document.state)) {
    console.log("Scheduled initApp after 1 second");
    setTimeout(initApp, 1000);
    return;
  }
  console.log("initApp invoked...");

  user = JSON.parse(localStorage.getItem("user"));
  myUserId = (user && user.uid) || (firebase.auth().currentUser && firebase.auth().currentUser.uid);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("current logged in user uid: " + user.uid);
      myUserId = user.uid;
      var currentUserElement = document.getElementById("current_user");
      if (currentUserElement) {
        currentUserElement.innerHTML = user.email;
      }
      if (typeof dispatch_uploads === 'function') {
        dispatch_uploads();
      }
    } else {
      window.location.href = "index.html";
    }
  });

  try {
    Highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'tahoma'
        }
      }
    });
  } catch (e) {
    console.log("Highcharts not available (cells will still render):", e);
  }

  skew();
  dispatch_uploads();
  document.title = "Quran Lights";
  show_sign_in_only_elements();

  // Periodic retry for upload queue (handles cases where online event
  // doesn't fire reliably, e.g. Android WebView / Capacitor)
  setInterval(function () {
    if (typeof dispatch_uploads === 'function' && navigator.onLine) {
      dispatch_uploads();
    }
  }, 30000);

  install_update_hook();

  // Safety net: render cells from localStorage immediately even if
  // the update_stamp listener never fires (e.g. RTDB offline on Android)
  if (typeof initCells === "function") {
    initCells();
  }
}

function install_update_hook() {
  //install hook for update reference
  var uid = (user && user.uid) || (firebase.auth().currentUser && firebase.auth().currentUser.uid);
  if (!uid) return;
  var update_timestamp_ref = firebase.database()
    .ref("users/" + uid + "/Master/update_stamp");
  update_timestamp_ref.on("value", function (snapshot) {
    var updatedValue = snapshot.val();
    var indexOfTimeStamp = ownTimeStamps.indexOf(updatedValue);
    if (indexOfTimeStamp != -1) {
      //delete matching own timestamp
      ownTimeStamps.splice(indexOfTimeStamp, 1);
      return;
    }
    //stabilize successive triggers
    if (timeStampTriggerTimerRef != null) {
      clearTimeout(timeStampTriggerTimerRef);
      console.log("Dropped repeated timestamp trigger.. ");
    }
    timeStampTriggerTimerRef = setTimeout(onTimeStampUpdated, isFirstLoad == 1 ? 0 : 5000);
    isFirstLoad = 0;
  }, function (error) {
    console.log("update_stamp listener error (cells may still render from cache):", error);
  });
}
