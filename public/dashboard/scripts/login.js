
//TODO move to index.html
function sign_out(){
  clear_reviews();
  showToast("Signing out...");
  // [START signout]
  firebase.auth().signOut();
  hide_sign_in_only_elements();
  document.getElementById("quickstart-sign-in").textContent = "Sign in";
  document.getElementById("sign-in-with-google").textContent = "Sign In with Google";
  //document.getElementById('sign-in-with-facebook').textContent = 'Sign In with Facebook';
  //document.getElementById('sign-in-with-twitter').textContent = 'Sign In with Twitter';
  //empty score
  document.getElementById("score").textContent = "--";
  document.getElementById("today_score").textContent = "--";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("daily-score-chart").innerHTML = "";
  document.getElementById("radar-chart").innerHTML = "";
  document.getElementById("monthly-score-chart").innerHTML = "";
  document.getElementById("dark_days_chart").innerHTML = "";
  document.getElementById("light_days_chart").innerHTML = "";
  document.getElementById("yearly-score-chart").innerHTML = "";
  document.getElementById("khatma-progress-chart").innerHTML = "";
  document.getElementById("treemap-chart").innerHTML = "";
  document.getElementById("memorization-chart").innerHTML = "";
  document.getElementById("conquer-ratio-chart-container").innerHTML = "";
  document.getElementById("light-ratio-chart-container").innerHTML = "";
  document.getElementById("sort_order").style.display = "none";
  document.getElementById("selected_total").style.display = "none";
  
  surasHistory = {};
  hideToast();
  // [END signout]
}

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  if (firebase.auth().currentUser) {
    sign_out();
  }
  else {
    sign_in();
  }
}

function sign_in() {
  setTimeout(delayed_sign_in, 3000);
  

  //move to index.html script on ready
  // show_sign_in_only_elements();
  // dispatch_uploads();
  // [END authwithemail]
}

function delayed_sign_in(){
  showToast("Signing in...");
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  if (email.length < 4) {
    alert("Please enter an email address.");
    return;
  }
  if (password.length < 4) {
    alert("Please enter a password.");
    return;
  }
  // Sign in with email and pass.
  // [START authwithemail]
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === "auth/wrong-password") {
        alert("Wrong password.");
      }
      else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
  hideToast();
  sessionStorage.setItem("firebase", firebase);
  window.location.href = "index.html";
  console.log("done login!!");

}