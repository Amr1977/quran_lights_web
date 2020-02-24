/**
 * The minimum history length is current khatma number - 1, suras with that mimimum history length are in the completed set, other suras are not completed yet.
 */
function getKhatmaProgressData() {
    var indexesOfSurasWithMinimumHistoryLength = [];
  
    //current minimum history length reached
    var minimumHistoryLength = surasHistory[1].history.length;
  
    //comulated char count of minimum history length suras
    var comulatedScoreOfCurrentMinimumHistoryLengthSuras = 0;
  
    var khatmaProgress = {};
  
    for (var suraIndex = 1; suraIndex <= 114; suraIndex++) {
      //check if current sura history length is less than current reached minimum
      if (surasHistory[suraIndex].history.length < minimumHistoryLength) {
        //reset mimimum
        minimumHistoryLength = surasHistory[suraIndex].history.length;
        indexesOfSurasWithMinimumHistoryLength = [suraIndex];
        comulatedScoreOfCurrentMinimumHistoryLengthSuras =
          suraCharCount[suraIndex - 1];
      }
      //check if current sura history equals current reached mimimum
      else if (surasHistory[suraIndex].history.length == minimumHistoryLength) {
        indexesOfSurasWithMinimumHistoryLength.push(suraIndex);
        comulatedScoreOfCurrentMinimumHistoryLengthSuras +=
          suraCharCount[suraIndex - 1];
      } else {
      }
    }
  
    khatmaProgress.data = [
      {
        name: "Remaining",
        y: comulatedScoreOfCurrentMinimumHistoryLengthSuras,
        sliced: true,
        selected: true,
        drilldown: "Remaining"
      },
      {
        name: "Completed",
        y: fullKhatmaCharCount - comulatedScoreOfCurrentMinimumHistoryLengthSuras,
        drilldown: "Completed"
      }
    ];
  
    //extract current khatma number
    khatmaProgress.currentKhatma = minimumHistoryLength + 1;
  
    var remainingDrillDownArray = [];
    var completedDrilldownArray = [];
    for (var index = 1; index <= 114; index++) {
      var entry = {
        name: SuraNamesEn[index - 1],
        y: suraCharCount[index - 1] //,
        //color: colorHash[index]
      };
      if (indexesOfSurasWithMinimumHistoryLength.indexOf(index) != -1) {
        remainingDrillDownArray.push(entry);
      } else {
        completedDrilldownArray.push(entry);
      }
    }
  
    remainingDrillDownArray = sortByKey(remainingDrillDownArray, "y");
    completedDrilldownArray = sortByKey(completedDrilldownArray, "y");
  
    khatmaProgress.drilldown = [
      {
        name: "Remaining",
        id: "Remaining",
        data: remainingDrillDownArray
      },
      {
        name: "Completed",
        id: "Completed",
        data: completedDrilldownArray
      }
    ];
  
    return khatmaProgress;
  }

  function drawKhatmaPieChart() {
    var khatmaProgress = getKhatmaProgressData();
    var data = khatmaProgress.data;
  
    // Build the chart
    Highcharts.chart("khatma-progress-chart", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      title: {
        text: "Khatma #" + khatmaProgress.currentKhatma + " Progress"
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            style: {
              color:
                (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                "green"
            },
            connectorColor: "silver"
          }
        }
      },
      series: [
        {
          name: "Khatma Progress",
          data: data
        }
      ],
  
      drilldown: {
        series: khatmaProgress.drilldown
      }
    });
  }