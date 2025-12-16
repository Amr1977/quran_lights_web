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

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      console.log("current logged in user uid: " + user.uid);
      var currentUserElement = document.getElementById("current_user");
      if (currentUserElement) {
        currentUserElement.innerHTML = user.email;
      }
      // Display user email in profile page if element exists
      var userEmailDisplay = document.getElementById("user-email-display");
      if (userEmailDisplay) {
        userEmailDisplay.innerHTML = "Logged in as: " + user.email;
      }
    } else {
      window.location.href = "index.html";
    }
  });

  Highcharts.setOptions({
    chart: {
      style: {
        fontFamily: 'tahoma'
      }
    }
  });

  skew();
  dispatch_uploads();
  document.title = "Quran Lights";
  show_sign_in_only_elements();

  install_update_hook();

}

function install_update_hook() {
  //install hook for update reference
  var update_timestamp_ref = firebase.database()
    .ref("users/" + user.uid + "/Master/update_stamp");
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
  });
}
