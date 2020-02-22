//TODO set memorization state
function set_memorization(suraIndex, state) {
    //TODO use constants instead of magic numbers
    var memorizationRecord = {
      op: "memorize",
      sura: suraIndex,
      state: state
    };
    var transactionTimeStamp = (Date.now() + serverOffset) * 1000;
    var newEntry = firebase
      .database()
      .ref(
        "users/" +
          firebase.auth().currentUser.uid +
          "/Master/reviews/" +
          transactionTimeStamp
      );
    //TODO complete this
    newEntry.set(memorizationRecord, function(error) {
      if (error) {
        alert("Data could not be saved, check your connection. " + error);
      } else {
        lastTransactionTimeStamp = transactionTimeStamp.toString();
        //update memorization
        surasHistory[suraIndex]; //.history.push(refreshTimeStamp);
        surasHistory[suraIndex].memorization = state;
        sortedTimestampSuraArray = [];
        refreshCountSortedSuraArray = [];
        addSuraCells();
        //to avoid pulling history again
        ownTimeStamps.push(transactionTimeStamp);
        //trigger update on other devices
        firebase
          .database()
          .ref(
            "users/" + firebase.auth().currentUser.uid + "/Master/update_stamp"
          )
          .set(transactionTimeStamp);
          if (state == MEMORIZATION_STATE_MEMORIZED) {
            playSuraRefreshSound();
          }
      }
    });
  }

  function toggle_memorization(suraIndex) {
    if (surasHistory[suraIndex].memorization == MEMORIZATION_STATE_MEMORIZED) {
      set_memorization(suraIndex, MEMORIZATION_STATE_NOT_MEMORIZED);
    } else {
      set_memorization(suraIndex, MEMORIZATION_STATE_MEMORIZED);
    }
  }


function getMemorizationData() {
    var memorizationData = {};
    var memorizedPercentage = 0;
    var wasMemorizedPercentage = 0;
    var beingMemorizedPercentage = 0;
    var notMemorizedPercentage = 0;
  
    var memorizedDrillDownArray = [];
    var wasMmorizedDrillDownArray = [];
    var beingMemorizedDrillDownArray = [];
    var notMemorizedDrillDownArray = [];
  
    for (var suraIndex = 0; suraIndex < 114; suraIndex++) {
      var entry = {
        name: SuraNamesEn[suraIndex],
        y: suraCharCount[suraIndex]
      };
      var suraScore = suraCharCount[suraIndex];
      switch (surasHistory[suraIndex + 1].memorization) {
        case "1":
          entry.drilldown = "WasMemorized";
          wasMmorizedDrillDownArray.push(entry);
          wasMemorizedPercentage += suraScore;
          break;
  
        case "2":
          entry.drilldown = "Memorized";
          memorizedDrillDownArray.push(entry);
          memorizedPercentage += suraScore;
          break;
  
        case "3":
          entry.drilldown = "BeingMemorized";
          beingMemorizedDrillDownArray.push(entry);
          beingMemorizedPercentage += suraScore;
          break;
  
        default:
          entry.drilldown = "NotMemorized";
          notMemorizedDrillDownArray.push(entry);
          notMemorizedPercentage += suraScore;
      }
    }
  
    beingMemorizedPercentage =
      (beingMemorizedPercentage / fullKhatmaCharCount) * 100;
    memorizedPercentage = (memorizedPercentage / fullKhatmaCharCount) * 100;
    wasMemorizedPercentage = (wasMemorizedPercentage / fullKhatmaCharCount) * 100;
    notMemorizedPercentage = (notMemorizedPercentage / fullKhatmaCharCount) * 100;
  
    memorizationData.data = [
      {
        name: "Memorized",
        y: memorizedPercentage,
        drilldown: "Memorized",
        sliced: true
      },
      {
        name: "Being Memorized",
        y: beingMemorizedPercentage,
        drilldown: "BeingMemorized"
      },
      {
        name: "Was Memorized",
        y: wasMemorizedPercentage,
        drilldown: "WasMemorized"
      },
      {
        name: "Not Memorized",
        y: notMemorizedPercentage,
        drilldown: "NotMemorized"
      }
    ];
  
    memorizationData.drilldown = [
      {
        name: "Memorized",
        id: "Memorized",
        data: memorizedDrillDownArray
      },
      {
        name: "BeingMemorized",
        id: "BeingMemorized",
        data: beingMemorizedDrillDownArray
      },
      {
        name: "WasMemorized",
        id: "WasMemorized",
        data: wasMmorizedDrillDownArray
      },
      {
        name: "NotMemorized",
        id: "NotMemorized",
        data: notMemorizedDrillDownArray
      }
    ];
  
    return memorizationData;
  }
  
  function drawMemorizationPieChart() {
    // Build the chart
  
    var memorizationOptions = getMemorizationData();
    var data = memorizationOptions.data;
  
    console.log("memorizationOptions", memorizationOptions);
  
    Highcharts.chart("memorization-chart", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      title: {
        text: "Memorization Progress"
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
          name: "Memorization Progress",
          data: data
        }
      ],
  
      drilldown: {
        series: memorizationOptions.drilldown
      }
    });
  }