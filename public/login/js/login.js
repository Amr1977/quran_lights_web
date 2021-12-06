
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

//TODO pass email and password as parameters
function sign_in(email, password){
  firebase.auth().signOut();
  add_auth_handler();

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

function sign_up(email, password) {
  firebase.auth().signOut();
  localStorage.removeItem("user");
  add_auth_handler();
  if (email.length < 4) {
    alert("Please enter an email address.");
    return;
  }
  if (password.length < 4) {
    alert("Please enter a password.");
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == "auth/weak-password") {
        alert("The password is too weak.");
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
}


function sign_in_with_google() {
  signInWithOAuth("google");
}

function signInWithOAuth(signInProvider) {

  add_auth_handler();
  switch (signInProvider) {
    case "google":
      var provider = new firebase.auth.GoogleAuthProvider();
      break;

    case "facebook":
      provider = new firebase.auth.FacebookAuthProvider();
      break;

    case "twitter":
      provider = new firebase.auth.TwitterAuthProvider();
      break;
  }

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      user = result.user;
      // ...
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}

function sign_in_with_facebook() {
  signInWithOAuth("facebook");
}

function signInWithTwitter() {
  signInWithOAuth("twitter");
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase
    .auth()
    .currentUser.sendEmailVerification()
    .then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert("Email Verification Sent!");
      // [END_EXCLUDE]
    });
  // [END sendemailverification]
}
function sendPasswordReset() {
  var email = document.getElementById("email").value;
  // [START sendpasswordemail]
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert("Password Reset Email Sent!");
      // [END_EXCLUDE]
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == "auth/invalid-email") {
        alert(errorMessage);
      } else if (errorCode == "auth/user-not-found") {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
  // [END sendpasswordemail];
}

document.account = true;