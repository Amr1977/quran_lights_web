/**
 * Used to avoid reacting to update_stamp triggers caused by self
 */
var ownTimeStamps = [];

function onTimeStampUpdated() {
    timeStampTriggerTimerRef = null;
    console.log("Fetching history...");
    initCells();
}
  
function skew() {
    var offsetRef = firebase.database().ref(".info/serverTimeOffset");
    offsetRef.on("value", function(snap) {
      serverOffset = snap.val();
    });
  }

  function bounce(suraIndex) {
    $(".sura-" + suraIndex).addClass("animated bounceIn");
  }

  function getTimeStamp() {
    return (Date.now() + serverOffset) * 1000;
  }