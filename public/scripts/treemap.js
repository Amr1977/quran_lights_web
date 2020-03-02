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
        data: getTreeMapData(),
        events: {
          click: function (event) {
            if (event.point.node.childrenTotal == 0) {//since last node will have zero childrens
              //Perform Task on leaf or last node
              console.log(event.point.name);
              refreshByName(event.point.name);

            }
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