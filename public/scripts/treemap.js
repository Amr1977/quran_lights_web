async function drawTreeMapChart(DevId) {
  Highcharts.chart(DevId, {
    colorAxis: {
      minColor: "#000",
      maxColor: "#00FF00"
    },
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        data: getTreeMapData(),
        events: {
          click: function (event) {
            click_handler(get_sura_index_from_sura_name(event.point.name));
            console.log("clicked cell: ", event.point.name);
          }
        }
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