
function signInWithGoogle() {
    signInWithOAuth("google");
  }
  
  function signInWithOAuth(signInProvider) {
    switch (signInProvider) {
      case "google":
        console.log("sign in with google");
        var provider = new firebase.auth.GoogleAuthProvider();
        break;
  
      case "facebook":
        console.log("sign in with facebook");
        provider = new firebase.auth.FacebookAuthProvider();
        break;
  
      case "twitter":
        console.log("sign in with Twitter");
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
  
  function signInWithFacebook() {
    signInWithOAuth("facebook");
  }
  
  function signInWithTwitter() {
    signInWithOAuth("twitter");
  }
  /**
   * Handles the sign up button press.
   */
  function handleSignUp() {
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
    // [START createwithemail]
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
    // [END createwithemail]
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
  