//TODO use async for all UI update operations!!
 async function update_charts() {
    drawMemorizationPieChart();
    //TODO update ticket https://trello.com/c/qf6EoLOB/106-1-daily-review-gauge-calculation
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
    
    updateGuageChart("light-ratio-chart-container", "Light Ratio", lightRatio);
    updateGuageChart("conquer-ratio-chart-container", "Conquer Ratio", conquerRatio);
    drawTimeSeriesChart("daily-score-chart", DAILY_SCORE_MODE);
    drawTimeSeriesChart("monthly-score-chart", MONTHLY_SCORE_MODE);
    drawTimeSeriesChart("yearly-score-chart", YEARLY_SCORE_MODE);
    drawTimeSeriesChart("dark_days_chart", DARK_DAYS_MODE);
    drawTimeSeriesChart("light_days_chart", LIGHT_DAYS_MODE);
    drawKhatmaPieChart();
    drawTreeMapChart("treemap-chart");
    drawRadarChart("radar-chart");
}

function get_review_werd(){
    return memorization_state["memorized"] / get_refresh_period_days();
}

function get_read_werd() {
    return (get_non_memorized_amount() / get_refresh_period_days());
}

function get_today_read() {
  return scores["today_read"];
}

function get_non_memorized_amount(){
  return memorization_state["not_memorized"];
}