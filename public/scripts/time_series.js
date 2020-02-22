/**
 * 
 * @param {*} divID 
 * @param {*} mode 0 dor days, 1 for months, 2 for years
 */

function drawTimeSeriesChart(divID, mode) {
    var data = time_series_score_date(mode);
    console.log("drawTimeSeriesChart", divID, mode, data);
    var chartTitle;
    switch(mode) {
        case 0://daily chart
        chartTitle = "Daily Score";
          break;
  
        case 1://monthly chart 
        chartTitle = "Monthly Score";
          break;
  
        case 2://yearly chart
        chartTitle = "Yearly Score";
          break;
  
          case 3:
            chartTitle=  "Dark Days";
            break;
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
      xAxis: {
        type: "datetime"
      },
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
          type: "area",
          name: "score",
          data: data
        }
      ]
    });
  }

  /**
 *
 * @param {*} mode 0 daily, 1 monthly, 2 yearly, 3 dark days
 */
function time_series_score_date(mode) {
    //TODO add zeros for missing days
    var allEntries = [];
    dark_days_map = new Map();
  
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
    // console.log("All entries: ", allEntries);
  
    var sortedEntries = sortByX(allEntries);
  
    var scoreArray = [];
    var periodScore = 0;
    var prevDate = new Date(sortedEntries[0][0]).getDate();
    var prevMonth = new Date(sortedEntries[0][0]).getMonth();
    var prevYear = new Date(sortedEntries[0][0]).getFullYear();
  
    if (mode == DARK_DAYS_MODE) {
      light_days_map = create_dark_days_map();
     }
    
    var periodStartTimestamp = sortedEntries[0][0];
    var periodEndTimestamp = sortedEntries[0][0];
    for (var index = 0; index < sortedEntries.length; index++) {
      var date = new Date(sortedEntries[index][0]);
      var currentDate = date.getDate();
      var currentMonth = date.getMonth();
      var currentYear = date.getFullYear();

      var year_month_key = currentYear + "-" + currentMonth;
      if(mode == DARK_DAYS_MODE) {
        light_days_map.get(year_month_key).delete(currentDate);
      }
      
      //ّFIXME first time item not correct
      if (
        (mode == DAILY_SCORE_MODE && Number(prevDate) != Number(currentDate)) ||
        ( mode == MONTHLY_SCORE_MODE && Number(prevMonth) != Number(currentMonth)) ||
        ( mode == DARK_DAYS_MODE && Number(prevMonth) != Number(currentMonth)) ||
        ( mode == YEARLY_SCORE_MODE && Number(prevYear) != Number(currentYear))
      ) {
        //accumulate a full scoring period
        periodEndTimestamp = sortedEntries[index - 1][0];
        var periodTimestamp = (periodEndTimestamp - periodStartTimestamp) / 2 + periodStartTimestamp;
        periodStartTimestamp = sortedEntries[index][0];
        if (mode == DARK_DAYS_MODE) {
          //TODO calculate dark days in month
          periodScore = light_days_map.get(year_month_key).size;
        }
        scoreArray.push([periodTimestamp, periodScore]);
  
        //console.log("score: ", sortedEntries[index][1]);
        if (mode !== DARK_DAYS_MODE) {
          periodScore = sortedEntries[index][1];
        }
        
        //console.log("dayScore: ",dayScore);
        //console.log("new date ", date, "current date/month/year", currentDate,"-", currentMonth, "-", currentYear, "prev date-month-year", prevDate, "-", prevMonth, "-", prevYear);
      } else {
  
        //console.log("score: ", sortedEntries[index][1]);
        periodScore += sortedEntries[index][1];
        //console.log("continue date ", date);
        //console.log("dayScore: ",dayScore);
        if (index == sortedEntries.length - 1) {
          if (mode == DARK_DAYS_MODE) {
            //TODO calculate dark days in month
            periodScore = light_days_map.get(year_month_key).size;
          }
          scoreArray.push([sortedEntries[index][0], periodScore]);
        }
      }
      
      prevDate = currentDate;
      prevMonth = currentMonth;
      prevYear = currentYear;
    }
  
    //console.log("dailyScoreArray: ", dailyScoreArray);
    console.log("dark_days_map:" + light_days_map);
  
    return scoreArray;
  }