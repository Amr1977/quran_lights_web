
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAn1GqNGEI3cB8pa5jBgaKxVdnf7xckw2c",
  authDomain: "quran-lights.firebaseapp.com",
  databaseURL: "https://quran-lights.firebaseio.com",
  projectId: "quran-lights",
  storageBucket: "quran-lights.appspot.com",
  messagingSenderId: "35819574492"
};
var surasHistory = {};//TODO replace {} with new Map()
var sortedTimestampSuraArray = [];

var colorHash = {};

//Do Refresh at midnight
var now = new Date();
var eta = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0) - now;
setTimeout(function(){
   addSuraCells();
}, eta);

//TODO fix for new FDB structure
function refreshSura(suraIndex, refreshTimeStamp) {
  //TODO update model
  //TODO check for empty history array

  //update FDB
  var refreshRecord = {
    op: "refresh",
    sura: suraIndex,
    time: refreshTimeStamp
  };
  var transactionTimeStamp = (Date.now() + serverOffset) * 1000;
  var newEntry = firebase
    .database()
    .ref(
      "users/" +
        firebase.auth().currentUser.uid +
        "/Master/reviews/" +
        transactionTimeStamp
    );
  newEntry.set(refreshRecord, function(error) {
    if (error) {
      alert("Data could not be saved, check your connection. " + error);
    } else {
      lastTransactionTimeStamp = transactionTimeStamp.toString();
      surasHistory[suraIndex].history.push(refreshTimeStamp);
      sortedTimestampSuraArray = [];
      refreshCountSortedSuraArray = [];
      addSuraCells();
      //to avoid pulling history again
      ownTimeStamps.push(transactionTimeStamp);
      //trigger update on other devices
      firebase
        .database()
        .ref(
          "users/" + firebase.auth().currentUser.uid + "/Master/update_stamp"
        )
        .set(transactionTimeStamp);
      playSuraRefreshSound();
    }
  });
}

var buildingSurasFlag = false;

firebase.initializeApp(config);

var timeStampTriggerTimerRef = null;
var periodicRefreshTimerRef = null;
var isFirstLoad = 1;

window.onload = function() {
  Raven.config(
    "https://55c264ec9a484103890f2ca7ad8a4543@sentry.io/238887"
  ).install();

  Raven.context(function() {
    initApp();
  });
};