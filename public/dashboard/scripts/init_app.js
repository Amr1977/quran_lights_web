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

  if (!user) {
    window.location.href = "index.html";
  } else {
    console.log("current logged in user uid: " + user.uid);
  }

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

function install_update_hook(){
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
