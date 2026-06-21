
function exportJSON() {
  var filename = "quran_lights_history_" + new Date().toISOString().slice(0, 10) + ".json";

  var blob = new Blob([export_history_to_json()], { type: "application/json;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
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

function export_history_to_json() {
  return JSON.stringify(surasHistory, null, 2);
}

function selectImportFile() {
  document.getElementById('selectFiles').click();
}

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
      document.getElementById('selectFiles').value = '';
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
    if (!history[suraIndex]) continue;

    if (
      surasHistory[suraIndex] && 
      surasHistory[suraIndex].history && 
      surasHistory[suraIndex].history.length > 0 && 
      history[suraIndex].history &&
      history[suraIndex].history.length > 0
      ) {
      var new_records = history[suraIndex].history.filter( x => !surasHistory[suraIndex].history.includes(x));
      new_records.sort(sortNumber);
      new_transactions = new_transactions.concat(create_refresh_transaction_batch(suraIndex, new_records));
      history[suraIndex].history = new_records;
      surasHistory[suraIndex].history = surasHistory[suraIndex].history.concat(new_records);
      surasHistory[suraIndex].history.sort(sortNumber);
    } else {
      if (!surasHistory[suraIndex] || !surasHistory[suraIndex].history || surasHistory[suraIndex].history.length == 0) {
        surasHistory[suraIndex] = {
          history: history[suraIndex].history || []
        };
        if (history[suraIndex].history && history[suraIndex].history.length) {
          new_transactions = new_transactions.concat(create_refresh_transaction_batch(suraIndex, history[suraIndex].history));
        }
      }
    }

    if (history[suraIndex].memorization != null) {
      if (!surasHistory[suraIndex]) {
        surasHistory[suraIndex] = { history: [] };
      }
      surasHistory[suraIndex].memorization = history[suraIndex].memorization;
      if (history[suraIndex].memorization_date) {
        surasHistory[suraIndex].memorization_date = history[suraIndex].memorization_date;
      }
      new_transactions.push(create_memorization_transaction_record(suraIndex, get_time_stamp(), history[suraIndex].memorization));
    }
  }

  for (var suraIndex in surasHistory) {
    if (surasHistory[suraIndex] && surasHistory[suraIndex].history) {
      surasHistory[suraIndex].history.sort(sortNumber);
    }
  }

  set_local_storage_object("surasHistory", surasHistory);
  enqueue_batch_for_upload(new_transactions);
}