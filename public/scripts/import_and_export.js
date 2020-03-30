

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
  return JSON.stringify(get_transactions_history(), null, 2);
}

//TODO implement import from json
function importJSON() {
  var files = document.getElementById('selectFiles').files;
  if (files.length <= 0) {
    return false;
  }

  var file_reader = new FileReader();
  file_reader.onload = function (e) {
    var result = is_json_string(e.target.result);
    console.log("imported & parser result: \n", result);
    if (result[0]) {
      var transactions = result[1];
      merge_imported_transactions_in_suras_history(transactions);
      addSuraCells();
      alert("IMPORT SUCCESS!");
    } else {
      console.log("INVALID JSON!!");
      alert("INVALID JSON!!")
    }
  }

  file_reader.readAsText(files.item(0));
}

function merge_imported_transactions_in_suras_history(transactions) {
  console.log(transactions);
  var duplicate_transactions_uuids = [];
  for (var transaction in transactions) {
    if (!transaction.uuid) {
      transaction.uuid = generate_uuid();
    }

    var suraIndex = transaction.sura;

    if (!surasHistory[suraIndex]) {
      surasHistory[suraIndex] = {};
      surasHistory[suraIndex].suraIndex = suraIndex;
      surasHistory[suraIndex].history = [];
      surasHistory[suraIndex].memorization = MEMORIZATION_STATE_NOT_MEMORIZED;
    }

    switch (transaction.op) {
      case "memorize":
        surasHistory[suraIndex].memorization = transaction.state;
        break;
      case "refresh":
        if (surasHistory[suraIndex].history.indexOf(transaction.time) == -1) {
          surasHistory[suraIndex].history.push(transaction.time);
        }
        else {
          console.log("duplicate refresh eliminated ", transaction);
          duplicate_transactions_uuids.push(transaction.uuid);
        }
    }
  }

  for (var suraIndex in surasHistory.keys) {
    surasHistory[suraIndex].history.sort(sortNumber);
  }
  addSuraCells();
  set_local_storage_object("surasHistory", surasHistory);

  if (duplicate_transactions_uuids.length) {
    transactions = transactions.filter(function (transaction) {
      return duplicate_transactions_uuids.indexOf(transaction.uuid) == -1;
    });
  }

  transactions.forEach((transaction) => { 
    enqueue_for_upload(transaction);
  });

  add_to_transactions_history(transactions);
}