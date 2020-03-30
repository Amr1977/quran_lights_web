//TODO move to sync.js file
function set_memorization(suraIndex, state) {
  var transaction_record = {
    op: "memorize",
    sura: suraIndex,
    state: state,
    time: get_time_stamp()
  };
  var transactions_records = [];
  transactions_records.push(transaction_record);
  add_to_transactions_history(transactions_records);

  enqueue_for_upload(transaction_record);
  // memorization should be array?
  surasHistory[suraIndex].memorization = state;
  sortedTimestampSuraArray = [];
  refreshCountSortedSuraArray = [];
  if (state == MEMORIZATION_STATE_MEMORIZED) {
    playSuraRefreshSound();
    animate_sura_cell(suraIndex);
  }
  
  add_sura_cells();
}

function animate_sura_cell(index) {
  $("sura-" + index).addClass("animate bounceIn");
}

function toggle_memorization(suraIndex) {
  if (surasHistory[suraIndex].memorization == MEMORIZATION_STATE_MEMORIZED) {
    set_memorization(suraIndex, MEMORIZATION_STATE_NOT_MEMORIZED);
  } else {
    set_memorization(suraIndex, MEMORIZATION_STATE_MEMORIZED);
  }
}

//TODO optimize to avoid repeating this calculation.
function get_memorization_data() {
  var memorizationData = {};
  var memorized_percentage = 0;
  var was_memorized_percentage = 0;
  var being_memorized_percentage = 0;
  var not_memorized_percentage = 0;

  var memorized_amount = 0;
  var was_memorized_amount = 0;
  var being_memorized_amount = 0;
  var not_memorized_amount = 0;

  var memorized_drill_down_array = [];
  var was_mmorized_drill_down_array = [];
  var being_memorized_drill_down_array = [];
  var not_memorized_drill_down_array = [];

  for (var suraIndex = 0; suraIndex < 114; suraIndex++) {
    var entry = {
      name: SuraNamesEn[suraIndex],
      y: suraCharCount[suraIndex]
    };
    var suraScore = suraCharCount[suraIndex];
    switch (surasHistory[suraIndex + 1].memorization) {
      case "1":
        entry.drilldown = "WasMemorized";
        was_mmorized_drill_down_array.push(entry);
        was_memorized_amount += suraScore;
        break;

      case "2":
        entry.drilldown = "Memorized";
        memorized_drill_down_array.push(entry);
        memorized_amount += suraScore;
        break;

      case "3":
        entry.drilldown = "BeingMemorized";
        being_memorized_drill_down_array.push(entry);
        being_memorized_amount += suraScore;
        break;

      default:
        entry.drilldown = "NotMemorized";
        not_memorized_drill_down_array.push(entry);
        not_memorized_amount += suraScore;
    }
  }

  being_memorized_percentage =
    (being_memorized_amount / fullKhatmaCharCount) * 100;
  memorized_percentage = (memorized_amount / fullKhatmaCharCount) * 100;
  was_memorized_percentage = (was_memorized_amount / fullKhatmaCharCount) * 100;
  not_memorized_percentage = (not_memorized_amount / fullKhatmaCharCount) * 100;

  memorizationData.data = [
    {
      name: "Memorized",
      y: memorized_percentage,
      drilldown: "Memorized",
      sliced: true
    },
    {
      name: "Being Memorized",
      y: being_memorized_percentage,
      drilldown: "BeingMemorized"
    },
    {
      name: "Was Memorized",
      y: was_memorized_percentage,
      drilldown: "WasMemorized"
    },
    {
      name: "Not Memorized",
      y: not_memorized_percentage,
      drilldown: "NotMemorized"
    }
  ];

  memorizationData.drilldown = [
    {
      name: "Memorized",
      id: "Memorized",
      data: memorized_drill_down_array
    },
    {
      name: "BeingMemorized",
      id: "BeingMemorized",
      data: being_memorized_drill_down_array
    },
    {
      name: "WasMemorized",
      id: "WasMemorized",
      data: was_mmorized_drill_down_array
    },
    {
      name: "NotMemorized",
      id: "NotMemorized",
      data: not_memorized_drill_down_array
    }
  ];

  return memorizationData;
}

async function drawMemorizationPieChart() {
  // Build the chart

  var memorizationOptions = get_memorization_data();
  var data = memorizationOptions.data;

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