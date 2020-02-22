function createHistoryLines() {
    var historyCSV = [["sura_index", "refresh_timestamp"]];
  
    for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
      var timeStampsArray =
        surasHistory[suraIndex] != null && surasHistory[suraIndex].history != null
          ? surasHistory[suraIndex].history
          : [];
      for (hindex = 0; hindex < timeStampsArray.length; hindex++) {
        var entry = [];
        entry.push(suraIndex, timeStampsArray[hindex]);
        historyCSV.push(entry);
      }
    }
  
    return historyCSV;
  }
  
  function exportToCsv() {
    var rows = createHistoryLines();
    var filename = "export.csv";
    var processRow = function(row) {
      var finalVal = "";
      for (var j = 0; j < row.length; j++) {
        var innerValue = row[j] === null ? "" : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ",";
        finalVal += result;
      }
      return finalVal + "\n";
    };
  
    var csvFile = "";
    for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }
  
    var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
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