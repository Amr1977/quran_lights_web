
//TODO fix it, memorization date info is dropped!!

function exportJSON() {
  var filename = "quran_lights_history.json";

  var blob = new Blob([export_history_to_json()], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

//TODO export and import using json format
function export_history_to_json() {
  return JSON.stringify(surasHistory, null, 2);
}

//TODO implement import from json
function importJSON() {
  showToast("Import Started...");
  var files = document.getElementById('selectFiles').files;
  if (files.length <= 0) {
    hideToast();
    alert("Choose Quran Lights history file to import!");
    return false;
  }

  var file_reader = new FileReader();
  file_reader.onload = function (e) {
    var result = is_json_string(e.target.result);
    if (result[0]) {
      var history = result[1];
      merge_imported_suras_history(history);
      add_sura_cells();
      hideToast();
      alert("IMPORT SUCCESS!");
    } else {
      hideToast();
      alert("INVALID JSON!!")
    }
  }

  file_reader.readAsText(files.item(0));
}

function create_refresh_transaction_record(sura_index, timestamp){
  var transaction_record = {
    op: "refresh",
    sura: sura_index,
    time: timestamp
  };

 return transaction_record;
}

function create_memorization_transaction_record(sura_index, timestamp, memorization_state){
  var transaction_record = {
    op: "memorize",
    sura: sura_index,
    state: memorization_state,
    time: timestamp
  };

 return transaction_record;
}

function create_refresh_transaction_batch(sura_index, timestamps) {
  var transactions = [];
  for(var key in timestamps) {
    var timestamp = timestamps[key];
    transactions.push(create_refresh_transaction_record(sura_index, timestamp));
  }

  return transactions;
}

function merge_imported_suras_history(history){
  var new_transactions = [];
  for (var suraIndex in history) {
    // Merge/update local refresh histories
    if (
      //both local and imported histories got entries
      surasHistory[suraIndex] && 
      surasHistory[suraIndex].history && 
      surasHistory[suraIndex].history.length > 0 && 
      history[suraIndex].history &&
      history[suraIndex].history.length > 0
      ) {
      //merge both histories
      var new_records = history[suraIndex].history.filter( x => !surasHistory[suraIndex].history.includes(x));
      new_records.sort(sortNumber);
      new_transactions = new_transactions.concat(create_refresh_transaction_batch(suraIndex, new_records));
      history[suraIndex].history = new_records;
      surasHistory[suraIndex].history = surasHistory[suraIndex].history.concat(new_records);
      surasHistory[suraIndex].history.sort(sortNumber);
    } else {
      if (!surasHistory[suraIndex] || !surasHistory[suraIndex].history || surasHistory[suraIndex].history.length == 0) {
        surasHistory[suraIndex] = history[suraIndex];
        if (history[suraIndex] && history[suraIndex].history &&  history[suraIndex].history.length) {
          new_transactions = new_transactions.concat(create_refresh_transaction_batch(suraIndex, history[suraIndex].history));
        }
      }
    }

    if (history[suraIndex] !== null && history[suraIndex].memorization !== null) {
      if (!surasHistory[suraIndex]) {
        surasHistory[suraIndex] = {};
      }
      surasHistory[suraIndex].memorization = history[suraIndex].memorization;
      //TODO fix this tragendy: no memorization data in surasHistory
      new_transactions.push(create_memorization_transaction_record(suraIndex, get_time_stamp(), history[suraIndex].memorization));
    }
  }

  for (var suraIndex in surasHistory.keys) {
    surasHistory[suraIndex].history.sort(sortNumber);
  }

  set_local_storage_object("surasHistory", surasHistory);
  enqueue_batch_for_upload(new_transactions);
}