

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
  return JSON.stringify(surasHistory);
}

//TODO implement import from json
function importJSON() {
  var files = document.getElementById('selectFiles').files;
  if (files.length <= 0) {
    return false;
  }

  var file_reader = new FileReader();

  file_reader.onload = function (e) {
    var result = JSON.parse(e.target.result);
    var formatted = JSON.stringify(result, null, 2);
  }

  file_reader.readAsText(files.item(0));
};