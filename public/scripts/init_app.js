/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]

  if (!(document.utils && document.constants && document.suras_data && document.state)) {
    setTimeout(initApp, 1000);
  }

  add_prayer_times();
  document
    .getElementById("password")
    .addEventListener("keyup", function (event) {
      event.preventDefault();
      if (event.keyCode == 13) {
        document.getElementById("quickstart-sign-in").click();
      }
    });
  firebase.auth().onAuthStateChanged(function (user) {
    document.getElementById("quickstart-sign-in").disabled = false;
    if (user) {
      Highcharts.setOptions({
        chart: {
            style: {
                fontFamily: 'tahoma'
            }
        }
    });
      skew();
      dispatch_uploads();
      document.title = "Quran Lights [" + user.email + "]";
      show_sign_in_only_elements();
      //document.getElementById("sign-in-with-facebook").style.display = "none";
      //document.getElementById("sign-in-with-twitter").style.display = "none";
      var update_timestamp_ref = firebase.database()
        .ref("users/" + firebase.auth().currentUser.uid + "/Master/update_stamp");
      update_timestamp_ref.on("value", function (snapshot) {
        var updatedValue = snapshot.val();
        var indexOfTimeStamp = ownTimeStamps.indexOf(updatedValue);
        if (indexOfTimeStamp != -1) {
          //delete matching own timestamp
          ownTimeStamps.splice(indexOfTimeStamp, 1);
          console.log("dropping own update.");
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
    else {
      document.title = "Quran Lights";
      clearInterval(periodicRefreshTimerRef);
      hide_sign_in_only_elements();
      //document.getElementById("sign-in-with-facebook").style.display = "block";
      //document.getElementById("sign-in-with-twitter").style.display = "block";
      // User is signed out.
      document.getElementById("quickstart-sign-in").textContent = "Sign in";
      //empty score
      document.getElementById("score").textContent = "--";
      //document.getElementById('quickstart-account-details').textContent = 'null';
    }
  });
  // [END authstatelistener]
  document
    .getElementById("quickstart-sign-in")
    .addEventListener("click", toggleSignIn, false);
  document
    .getElementById("quickstart-sign-up")
    .addEventListener("click", handleSignUp, false);
  document
    .getElementById("sign-in-with-google")
    .addEventListener("click", signInWithGoogle, false);
  //document.getElementById('sign-in-with-facebook').addEventListener('click', signInWithFacebook, false);
  //document.getElementById('sign-in-with-twitter').addEventListener('click', signInWithTwitter, false);
}