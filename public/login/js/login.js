
//TODO move to index.html
function sign_out(){
  firebase.auth().signOut();
  localStorage.removeItem("user");
  window.location.href="index.html";
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

function sign_in(){
  add_auth_handler();
  var email = document.getElementById("your_name").value;
  var password = document.getElementById("your_pass").value;
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
    .catch( (error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === "auth/wrong-password") {
        alert("Wrong password.");
      }
      else {
        alert(JSON.stringify(error));
      }
      console.log(JSON.stringify(error));
      // [END_EXCLUDE]
    });
}

function add_auth_handler() {
  // Listening for auth state changes.
  // [START authstatelistener]
  console.log("add_auth_handler invoked...");
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "dashboard.html";
    }
  });
}