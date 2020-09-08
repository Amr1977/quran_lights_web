function openTab(evt, id) {
    turn_all_tbs_off();
    document.getElementById(id).style.display = "block";
    evt.currentTarget.className += " active";
    switch(id) {
      case "light_radar":
        drawRadarChart("radar-chart");
        break;

        case "light_treemap":
        drawTreeMapChart("treemap-chart");
        break;

        case "memorization_chart_tab":
        drawMemorizationPieChart();
        if (isNaN(scores["today_review"])) {
          console.log("deferring guage chart rendering");
        setTimeout(function() {
          console.log("performing guage chart rendering");
          updateGuageChart("review_score_guage", 
                         "Today Review Revenue [" + format(scores["today_review"]) + " of Target " + format(get_review_werd()) + "]", 
                         100 * Number(scores["today_review"]) / get_review_werd());
        updateGuageChart("daily-read-guage", "Today Read Revenue [" + format(scores["today_read"]) + " of Target " + format(get_read_werd()) + "]",
                        100 * get_today_read() / get_read_werd());
        }, 2000);
        }
        break;

        case "review_guage":
          updateGuageChart("review_score_guage", 
          "Today Review Revenue [" + format(scores["today_review"]) + " of Target " + format(get_review_werd()) + "]", 
          100 * Number(scores["today_review"]) / get_review_werd());
        break;

        case "daily_read_guage":
          updateGuageChart("daily-read-guage", "Today Read Revenue [" + format(scores["today_read"]) + " of Target " + format(get_read_werd()) + "]",
          100 * get_today_read() / get_read_werd());
        break;

        case "light_ratio_chart_tab":
          updateGuageChart("light-ratio-chart-container", "Light Ratio", lightRatio);
        break;

        case "conquer_ratio_chart_tab":
          updateGuageChart("conquer-ratio-chart-container", "Conquer Ratio", conquerRatio);
        break;

        case "khatma_progress_tab":
          drawKhatmaPieChart();
        break;

        case "daily_score_chart_tab":
          drawTimeSeriesChart("daily-score-chart", DAILY_SCORE_MODE);
        break;

        case "monthly_score_chart_tab":
          drawTimeSeriesChart("monthly-score-chart", MONTHLY_SCORE_MODE);
        break;

        case "yearly_score_chart_tab":
          drawTimeSeriesChart("yearly-score-chart", YEARLY_SCORE_MODE);
        break;

        case "light_days_chart_tab":
          drawTimeSeriesChart("light_days_chart", LIGHT_DAYS_MODE);
        break;

        case "dark_days_chart_tab":
          drawTimeSeriesChart("dark_days_chart", LIGHT_DAYS_MODE);
        break;

        default: ;
    }
  }

  function click_light_cells_tab(){
    turn_all_tbs_off();
    document.getElementById("light_cells").style.display = "block";
    document.getElementById("cells_link").className += " active";
  }

  function turn_all_tbs_off() {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  }