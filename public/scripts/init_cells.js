function initCells() {
  var user = firebase.auth().currentUser;
  if (user) {
    document.getElementById("quickstart-sign-in").textContent = "Sign out";
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    var myUserId = firebase.auth().currentUser.uid;
    var database = firebase.database();
    //TODO add query to fetch new records only
    //console.log("grapping transactions after ", lastTransactionTimeStamp);
    lastTransactionTimeStamp = Number(localStorage.lastTransactionTimeStamp);
    surasHistory = localStorage.surasHistory;

    if (surasHistory == null || lastTransactionTimeStamp == null) {
      lastTransactionTimeStamp = 0;
    }

    var reviewsRef = firebase
      .database()
      .ref("users/" + myUserId + "/Master/reviews")
      .orderByKey()
      .startAt(lastTransactionTimeStamp.toString());
    showToast("Fetching history...");
    reviewsRef.once("value", function (snapshot) {
      hideToast();
      //surasHistory = {};
      var bounceList = [];
      if (snapshot != null) {
        snapshot.forEach(function (childSnapshot) {
          var transactionTimeStamp = childSnapshot.key;
          if (lastTransactionTimeStamp == transactionTimeStamp) {
            return;
          }
          //console.log("transactionTimeStamp ", transactionTimeStamp);
          if (Number(transactionTimeStamp) > Number(lastTransactionTimeStamp)) {
            lastTransactionTimeStamp = transactionTimeStamp;
            localStorage.lastTransactionTimeStamp = lastTransactionTimeStamp;
          }
          var transactionRecord = childSnapshot.val();
          var suraIndex = transactionRecord.sura;
          bounceList.push(suraIndex);
          if (surasHistory[suraIndex] == null) {
            surasHistory[suraIndex] = {};
            surasHistory[suraIndex].suraIndex = suraIndex;
            surasHistory[suraIndex].history = [];
          }
          switch (transactionRecord.op) {
            case "memorize":
              surasHistory[suraIndex].memorization = transactionRecord.state;
              break;
            case "refresh":
              if (surasHistory[suraIndex].history.indexOf(transactionRecord.time) == -1) {
                surasHistory[suraIndex].history.push(transactionRecord.time);
              }
              else {
                console.log("duplicate refresh eliminated ", transactionRecord);
              }
          }
        });
        for (var suraIndex in surasHistory.keys) {
          surasHistory[suraIndex].history.sort(sortNumber);
        }
        //console.log("last transactions timestamp: ", lastTransactionTimeStamp);
      }
      localStorage.surasHistory = surasHistory;
      document.getElementById("reviews").textContent = "";
      sortedTimestampSuraArray = [];
      refreshCountSortedSuraArray = [];
      //console.log("surasHistory:" + surasHistory);
      addSuraCells();
      bounceList.forEach(function (suraIndex) {
        bounce(suraIndex);
      });
    });
    // [START_EXCLUDE]
    // [END_EXCLUDE]
  }
}
