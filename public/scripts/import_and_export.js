

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
  var files = document.getElementById('selectFiles').files;
  if (files.length <= 0) {
    return false;
  }

  var file_reader = new FileReader();
  file_reader.onload = function (e) {
    var result = is_json_string(e.target.result);
    console.log("imported & parser result: \n", result);
    if (result[0]) {
      var history = result[1];
      merge_imported_history(history);
      addSuraCells();
    } else {
      console.log("invalid json dropped");
    }
  }

  file_reader.readAsText(files.item(0));
}

function merge_imported_history(history){
  console.log(history);
  for (var suraIndex in history) {
    // Merge/update local refresh histories
    if (
      surasHistory[suraIndex] && 
      surasHistory[suraIndex].history && 
      surasHistory[suraIndex].history.length > 0 && 
      history[suraIndex].history &&
      history[suraIndex].history.length > 0
      ) {
      //merge both histories
      console.log("Merge imported history for ", suraIndex);
      var new_records = history[suraIndex].history.filter( x => !surasHistory[suraIndex].history.includes(x));
      history[suraIndex].history = new_records;
      surasHistory[suraIndex].history = surasHistory[suraIndex].history.concat(new_records);
    } else {
      if (!surasHistory[suraIndex] || !surasHistory[suraIndex].history || surasHistory[suraIndex].history.length == 0) {
        console.log("Replace with imported history for ", suraIndex);
        surasHistory[suraIndex] = history[suraIndex];
      }
    }

    if (surasHistory[suraIndex] && !surasHistory[suraIndex].memorization && history[suraIndex].memorization) {
      console.log("MSet memorization for ", suraIndex);
      surasHistory[suraIndex].memorization = history[suraIndex].memorization;
    } else {
      history[suraIndex].memorization = null;
    }
  }

  //filtered history, removed already existing entries
  return history;
}

function update_firebase_database(history) {
//TODO do it!
}