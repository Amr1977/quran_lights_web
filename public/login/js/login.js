
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