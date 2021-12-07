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
  offsetRef.on("value", function (snap) {
    serverOffset = snap.val();
  });
}

function bounce(suraIndex) {
  $(".sura-" + suraIndex).addClass("animated bounceIn");
}

/**
 * upload queue, gets filled on refreshes and cell memorization state updates, then a dispatcher should process it async.
 * TODO read on user login
 */
function get_upload_queue() {
  return get_initial_local_object("upload_queue", []);
}

function set_upload_queue(queue) {
  set_local_storage_object("upload_queue", queue);
}

var reference_to_scheduled_upload_function;

function enqueue_for_upload(transaction_record) {
  console.log("enqueue_for_upload: \n" + transaction_record);
  var queue = get_upload_queue();
  queue.unshift(transaction_record);
  set_upload_queue(queue);
  clearTimeout(reference_to_scheduled_upload_function);
  reference_to_scheduled_upload_function = setTimeout(dispatch_uploads, UPLOAD_DISPATCH_DAMPING_DELAY);
}

function enqueue_batch_for_upload(records) {
  console.log("enqueue_for_upload: \n" + records);
  var queue = get_upload_queue();
  queue = records.concat(queue);
  set_upload_queue(queue);
  dispatch_uploads();
}

function dispatch_uploads() {
  //upload all enqueued transactions
  console.log("Upload Queue: ", get_upload_queue());
  if (get_upload_queue().length == 0) {
    return;
  }

  //TODO start handling upload transactions records here
  var updates = {};
  get_upload_queue().forEach((transacton_record) => {
    var transactionTimeStamp = get_time_stamp();
    firebase.database().ref(`users/${firebase.auth().currentUser.uid}/Master/reviews/` + transactionTimeStamp).set({});
    updates[`users/${firebase.auth().currentUser.uid}/Master/reviews/` + transactionTimeStamp] = transacton_record;
    lastTransactionTimeStamp = transactionTimeStamp;
    ownTimeStamps.push(lastTransactionTimeStamp);
  });

  firebase.database().ref().update(updates, function (error) {
    if (error) {
      alert("Data could not be saved, check your connection. " + error);
      console.log("upload ERROR: " + updates);
      //TODDO reschedule upload attempt!!
      clearTimeout(reference_to_scheduled_upload_function);
      reference_to_scheduled_upload_function = setTimeout(dispatch_uploads, UPLOAD_DISPATCH_DAMPING_DELAY * 3);
      playSound(error_sound_spring);
    } else {
      console.log("upload success: " + updates);
      //trigger update on other devices
      firebase
        .database()
        .ref(
          "users/" + firebase.auth().currentUser.uid + "/Master/update_stamp"
        )
        .set(lastTransactionTimeStamp);
      remove_from_queue(updates);
      playSound(pulse_sound);
    }
  });

}

function get_firebase_reviews_node() {
  return firebase.database().ref(`users/${firebase.auth().currentUser.uid}/Master/reviews`);
}

function get_firebase_update_stamp_node() {
  return firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/Master/update_stamp");
}

function get_firebase_settings_node() {
  return firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/Master/settings");
}

function remove_from_queue(transactions_records_to_be_removed) {
  var upload_queue = get_upload_queue();

  for (var key in transactions_records_to_be_removed) {
    upload_queue = upload_queue.filter(function (upload_queue_entry) {
      return upload_queue_entry.uuid !== transactions_records_to_be_removed[key].uuid;
    });
  }

  set_upload_queue(upload_queue);
}

const TRANSACTIONS_HISTORY_KEY = "transactions_history";
function get_transactions_history() {
  return get_initial_local_object(TRANSACTIONS_HISTORY_KEY, []);
}

function add_to_transactions_history(transactions_records) {
  var transactions_history = get_transactions_history();

  transactions_records = transactions_records.filter(function(transaction) {
    for(var old_transaction in transactions_history) {
      if (old_transaction.uuid == transaction.uuid) {
        return false;
      }
    }
    return true;
  });

  var merged_history = transactions_history.concat(transactions_records);
  //merged_history.sort(sort_transactions_by_timestamp);
  set_local_storage_object(TRANSACTIONS_HISTORY_KEY, merged_history);
}

function fetch_full_history_once() {
  var already_fetched_history = get_initial_local_object("already_fetched_history", false);
  if (already_fetched_history) {
    return;
  }

  myUserId = firebase.auth().currentUser.uid;
  firebase
      .database()
      .ref("users/" + myUserId + "/Master/reviews")
      .once("value", function (snapshot) {
    if (snapshot != null) {
      var transactions_records = [];
      snapshot.forEach(function (childSnapshot) {
        var transaction_record = childSnapshot.val();
        transactions_records.push(transaction_record);

      });
      add_to_transactions_history(transactions_records);
      set_local_storage_object("already_fetched_history", true);
      console.log("fetch_full_history: " + transactions_records);
    }
  });
}

//WIP
function refresh_range(start_sura_index, start_verse, end_sura_index, end_verse, refresh_count, refresh_time_stamp){
  var transaction_record = {
    op: "refresh_range",
    start_sura: start_sura_index,
    start_verse: start_verse,
    end_sura: end_sura_index,
    end_verse: end_verse,
    count: refresh_count,
    time: refreshTimeStamp,
    uid: generate_uuid()
  };

  var transactions_records = [];
  transactions_records.push(transaction_record);
  add_to_transactions_history(transactions_records);

  enqueue_for_upload(transaction_record);
  //FIX
  surasHistory[suraIndex].history.push(transaction_record.time);
  sortedTimestampSuraArray = [];
  refreshCountSortedSuraArray = [];
  playSuraRefreshSound();
  add_sura_cells();
  animate_score_elements();
}