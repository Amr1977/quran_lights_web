function drawTreeMapChart(DevId) {
    Highcharts.chart(DevId, {
      colorAxis: {
        minColor: "#000",
        maxColor: "#00FF00"
      },
      series: [
        {
          type: "treemap",
          layoutAlgorithm: "squarified",
          data: getTreeMapData()
        }
      ],
      title: {
        text: "Lights TreeMap"
      }
    });
  }
  
  function getTreeMapData() {
    var data = [];
    for (var suraIndex = 0; suraIndex < 114; suraIndex++) {
      var suraTile = {};
      suraTile.name = SuraNamesEn[suraIndex];
      suraTile.value = suraCharCount[suraIndex];
      suraTile.colorValue = surasColorTable[suraIndex];
      data.push(suraTile);
    }
  
    return data;
  }