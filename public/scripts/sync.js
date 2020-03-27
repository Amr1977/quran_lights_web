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

/**
 * upload queue, gets filled on refreshes and cell memorization state updates, then a dispatcher should process it async
 */
var upload_queue = [];
var reference_to_scheduled_upload_function;

function get_upload_queue() {
   var queue = getLocalStorageObject("upload_queue");
   if (queue) {
       upload_queue = queue;
   }

   return upload_queue;
}

function pop_from_upload_queue() {
   //TODO do it!
}
// Start uploading after 10 seconds of last enqueue
const UPLOAD_DISPATCH_DAMPING_DELAY = 10_000;
function enqueue_for_upload(transaction_record) {
    //TODO do it!
    get_upload_queue().unshift(transaction_record);
    clearTimeout(reference_to_scheduled_upload_function);
    reference_to_scheduled_upload_function = setTimeout(dispatch_uploads, UPLOAD_DISPATCH_DAMPING_DELAY);
}

function dispatch_uploads() {
  //upload all enqueued transactions
}