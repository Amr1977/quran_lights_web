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