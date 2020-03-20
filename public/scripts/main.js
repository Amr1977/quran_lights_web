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
  newEntry.set(refreshRecord, function (error) {
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
      animate_score_elements();
    }
  });
}

function animate_score_elements(){
  $(".score").addClass("animated bounceIn");
}

function refreshByName(suraName) {
  refreshSura(SuraNamesEn.indexOf(suraName) + 1, Math.floor(Date.now() / 1000))
}

var buildingSurasFlag = false;

firebase.initializeApp(config);

var timeStampTriggerTimerRef = null;
var periodicRefreshTimerRef = null;
var isFirstLoad = 1;

window.onload = function () {
  Raven.config(
    "https://55c264ec9a484103890f2ca7ad8a4543@sentry.io/238887"
  ).install();

  Raven.context(function () {
    initApp();
  });
};

function set_light_days() {
  var light_days_selection_element = document.getElementById("light_days");
  var light_days_count = Number(light_days_selection_element.value);
  set_refresh_period_days(light_days_count);
  addSuraCells();
}

function setup_light_days_options() {
  var light_days_selection_element = document.getElementById("light_days");
  light_days_selection_element.innerHTML = "";
  for (var i = 1; i < 31; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    light_days_selection_element.appendChild(option);
  }

  light_days_selection_element.value = get_refresh_period_days();
}

function show_sign_in_only_elements() {
  for (var i = 0; i < SIGN_IN_ONLY_ELEMENTS.length; i++) {
    var element = document.getElementById(SIGN_IN_ONLY_ELEMENTS[i]);
    if(element) element.style.display = "block";
  }

  for (var i = 0; i < SIGN_OUT_ONLY_ELEMENTS.length; i++) {
    var element = document.getElementById(SIGN_OUT_ONLY_ELEMENTS[i]);
    if(element) element.style.display = "none";
  }
}

function hide_sign_in_only_elements(){
  for (var i = 0; i < SIGN_IN_ONLY_ELEMENTS.length; i++) {
    var element = document.getElementById(SIGN_IN_ONLY_ELEMENTS[i]);
    if(element) element.style.display = "none";
  }

  for (var i = 0; i < SIGN_OUT_ONLY_ELEMENTS.length; i++) {
    var element = document.getElementById(SIGN_OUT_ONLY_ELEMENTS[i]);
    if(element) element.style.display = "block";
  }
}