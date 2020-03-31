//TODO use async for all UI update operations!!
async function update_charts() {
    drawMemorizationPieChart();
    //TODO update ticket https://trello.com/c/qf6EoLOB/106-1-daily-review-gauge-calculation
    var daily_review_max = fullKhatmaCharCount / get_refresh_period_days();
    updateGuageChart("review_score_guage", "Today Review Ratio [" + readableFormat(review_today) 
                   + " of Target " + readableFormat(daily_review_max) + "], ", 100 * review_today / daily_review_max);
    updateGuageChart("daily-read-guage", "Daily Read Progress", 100 * get_today_read() / (get_non_memorized_amount() / get_refresh_period_days()));
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

function get_today_read() {
    console.log("today_read: " + scores["today_read"]);
  return scores["today_read"];
}

function get_non_memorized_amount(){
  return memorization_state["not_memorized"];
}