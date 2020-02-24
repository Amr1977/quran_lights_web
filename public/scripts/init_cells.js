function initCells() {
  user = firebase.auth().currentUser;
  if (user) {
    document.getElementById("quickstart-sign-in").textContent = "Sign out " + user.email;
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    myUserId = firebase.auth().currentUser.uid;
    var database = firebase.database();
    console.log("grapping transactions after ", lastTransactionTimeStamp);

    var history = getLocalStorageObject("surasHistory");
    if (history) {
      surasHistory = history;
    }

    var lastTimeStamp = getLocalStorageObject("lastTransactionTimeStamp");

    if (lastTimeStamp) {
      lastTransactionTimeStamp = lastTimeStamp;
    }

    sort_order = getLocalStorageObject("sort_order");
    if (sort_order) {
      set_sort_order_with_value(sort_order);
    } else {
      sort_order = SORT_ORDER_NORMAL;
    }

    selected_suras = getLocalStorageObject("selected_suras")
    if (!selected_suras) { 
      selected_suras = []; 
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
          if (Number(transactionTimeStamp) > Number(lastTransactionTimeStamp)) {
            lastTransactionTimeStamp = transactionTimeStamp;
            setLocalStorageObject("lastTransactionTimeStamp", lastTransactionTimeStamp);
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
        setLocalStorageObject("surasHistory", surasHistory);
        setLocalStorageObject("lastTransactionTimeStamp", lastTransactionTimeStamp);
      }

      document.getElementById("reviews").textContent = "";
      sortedTimestampSuraArray = [];
      refreshCountSortedSuraArray = [];
      addSuraCells();
      bounceList.forEach(function (suraIndex) {
        bounce(suraIndex);
      });
    });
    // [START_EXCLUDE]
    // [END_EXCLUDE]
  }
}
