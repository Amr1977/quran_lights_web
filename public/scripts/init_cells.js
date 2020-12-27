//Do Refresh at midnight
var now = new Date();
var eta = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0) - now;
// setTimeout(function(){
//   add_sura_cells();
// }, eta);

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

    var lastTimeStamp = get_local_storage_object("lastTransactionTimeStamp");

    if (lastTimeStamp) {
      lastTransactionTimeStamp = lastTimeStamp;
    } else {
      lastTransactionTimeStamp = 0;
      set_local_storage_object("lastTransactionTimeStamp", 0);
    }
    var history = get_local_storage_object("surasHistory");
    if (history) {
      surasHistory = history;
    } else {
      lastTransactionTimeStamp = 0;
      set_local_storage_object("lastTransactionTimeStamp", 0);
    }

    console.log("grapping transactions after ", lastTransactionTimeStamp);

    sort_order = get_local_storage_object("sort_order");
    if (sort_order) {
      set_sort_order_with_value(sort_order);
    } else {
      set_sort_order_with_value(SORT_ORDER_NORMAL);
    }

    selected_suras = get_local_storage_object("selected_suras")
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
          //TODO check on guid here to avoid dropping valid different transactions
          //TODO review/refactor model
          var transactionTimeStamp = childSnapshot.key;
          if (lastTransactionTimeStamp == transactionTimeStamp) {
            return;
          }
          if (Number(transactionTimeStamp) > Number(lastTransactionTimeStamp)) {
            lastTransactionTimeStamp = transactionTimeStamp;
            set_local_storage_object("lastTransactionTimeStamp", lastTransactionTimeStamp);
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
        set_local_storage_object("surasHistory", surasHistory);
        set_local_storage_object("lastTransactionTimeStamp", lastTransactionTimeStamp);
      }

      document.getElementById("reviews").textContent = "";
      sortedTimestampSuraArray = [];
      refreshCountSortedSuraArray = [];
      add_sura_cells();
      click_light_cells_tab();
      bounceList.forEach(function (suraIndex) {
        bounce(suraIndex);
      });
      if(bounceList.length) {
        playSuraRefreshSound();
      }
    });
  }
}
