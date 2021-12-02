function get_flat_timestamp_score_array() {
  var allEntries = [];

  for (cellIndex = 1; cellIndex <= 114; cellIndex++) {
    var history = surasHistory[cellIndex].history;
    for (entry = 0; entry < history.length; entry++) {
      var timestamp = history[entry] * 1000;
      allEntries.push([timestamp, suraCharCount[cellIndex - 1]]);
    }
  }

  if (allEntries.length == 0) {
    return [];
  }

  var sortedEntries = sortByX(allEntries);

  return sortedEntries;
}

/**
 * 
 * @param {*} divID 
 * @param {*} mode 0 dor days, 1 for months, 2 for years, 3 refresh count times score
 */

async function drawTimeSeriesChart(divID, mode) {
  var data = {};

  switch (mode) {
    case DARK_DAYS_MODE:
      data = dark_days_data();
      break;

    case LIGHT_DAYS_MODE:
      data = light_days_data();
      break;

      case REFRESH_COUNT_TIME_SCORE_MODE:
        data = refresh_count_times_score();
        break;


    default:
      data = time_series_score_data(mode);
  }


  var chartTitle;
  var xAxe = {
    type: "datetime"
  };
  switch (mode) {
    case DAILY_SCORE_MODE://daily chart
      chartTitle = "Daily Revenue";
      break;

    case MONTHLY_SCORE_MODE://monthly chart 
      chartTitle = "Monthly Revenue";
      break;

    case YEARLY_SCORE_MODE://yearly chart
      chartTitle = "Yearly Revenue";
      break;

    case DARK_DAYS_MODE:
      chartTitle = "Dark Days";
      break;

    case LIGHT_DAYS_MODE:
      chartTitle = "Bright Days";
      break;

      case REFRESH_COUNT_TIME_SCORE_MODE:
        chartTitle = "Surah Score";
        xAxe = { categories: SuraNamesEn };
        break;

        default:
          chartTitle = "Title";

  }
  Highcharts.chart(divID, {
    chart: {
      zoomType: "x"
    },
    title: {
      text: chartTitle
    },
    subtitle: {
      text:
        document.ontouchstart === undefined
          ? "Click and drag in the plot area to zoom in"
          : "Pinch the chart to zoom in"
    },
    xAxis: xAxe,
    yAxis: {
      title: {
        text: chartTitle
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.Color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get("rgba")
            ]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },

    series: [
      {
        type: "column",
        name: "Revenue",
        data: data
      }
    ]
  });
}

/**
*
* @param {*} mode 0 daily, 1 monthly, 2 yearly, 3 RefreshCountxScoreChart
*/
function time_series_score_data(mode) {
  //TODO add zeros for missing days
  var allEntries = [];
  dark_days_map = {};

  for (cellIndex = 1; cellIndex <= 114; cellIndex++) {
    var history = surasHistory[cellIndex].history;
    for (entry = 0; entry < history.length; entry++) {
      var timestamp = history[entry] * 1000;
      if (timestamp) {
        allEntries.push([timestamp, suraCharCount[cellIndex - 1]]);
      }
      
    }
  }

  if (allEntries.length == 0) {
    return [];
  }

  var sortedEntries = sortByX(allEntries);

  var scoreArray = [];
  var periodScore = 0;
  var prevDate = new Date(sortedEntries[0][0]).getDate();
  var prevMonth = new Date(sortedEntries[0][0]).getMonth() + 1;
  var prevYear = new Date(sortedEntries[0][0]).getFullYear();

  var periodStartTimestamp = sortedEntries[0][0];
  var periodEndTimestamp = sortedEntries[0][0];

  var day_high_score = 0;
  var month_high_score = 0;
  var year_high_score = 0;

  for (var index = 0; index < sortedEntries.length; index++) {
    var date = new Date(sortedEntries[index][0]);
    var currentDate = date.getDate();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();

    //ّFIXME first time item not correct
    if (
      (mode == DAILY_SCORE_MODE && Number(prevDate) != Number(currentDate)) ||
      (mode == MONTHLY_SCORE_MODE && Number(prevMonth) != Number(currentMonth)) ||
      (mode == YEARLY_SCORE_MODE && Number(prevYear) != Number(currentYear))
    ) {
      //accumulate a full scoring period
      periodEndTimestamp = sortedEntries[index - 1][0];
      var periodTimestamp = (periodEndTimestamp - periodStartTimestamp) / 2 + periodStartTimestamp;
      periodStartTimestamp = sortedEntries[index][0];

      if(periodEndTimestamp == 1610296531000) {
        console.log("filter: ", sortedEntries[index][0]);
      } else {
        scoreArray.push([periodTimestamp, periodScore]);
        if(mode == DAILY_SCORE_MODE) {
          if (periodScore > day_high_score) {
            day_high_score = periodScore;
          }
        }
  
        if(mode == MONTHLY_SCORE_MODE) {
          if (periodScore > month_high_score) {
            month_high_score = periodScore;
          }
        }
  
        if(mode == YEARLY_SCORE_MODE) {
          if (periodScore > year_high_score) {
            year_high_score = periodScore;
          }
        }
      }
      
      if (mode !== DARK_DAYS_MODE) {
        periodScore = sortedEntries[index][1];
      }
    } else {
      if(periodEndTimestamp == 1610296531000) {
        console.log("filter: ", sortedEntries[index][0]);
      } else {
        periodScore += sortedEntries[index][1];
      }
      
      if (index == (sortedEntries.length - 1)) {
        scoreArray.push([sortedEntries[index][0], periodScore]);
      }
    }

    prevDate = currentDate;
    prevMonth = currentMonth;
    prevYear = currentYear;
  }

  if (mode == DAILY_SCORE_MODE) {
    scores["day_high_score"] = day_high_score;
    console.log("day high score ", day_high_score)
  }

  if (mode == MONTHLY_SCORE_MODE) {
    scores["month_high_score"] = month_high_score;
  }

  if (mode == YEARLY_SCORE_MODE) {
    scores["year_high_score"] = year_high_score;
  }

  return scoreArray;
}

function refresh_count_times_score(){
  var scoreArray = [];
  
  for (let cellIndex = 1; cellIndex <= 114; cellIndex++) {
    var history = surasHistory[cellIndex].history;
    scoreArray.push([SuraNamesEn[cellIndex - 1], history.length * suraCharCount[cellIndex - 1]]);
  }

  return scoreArray;
}