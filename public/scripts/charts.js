function update_charts() {
    updateGuageChart("light-ratio-chart-container", "Light Ratio", lightRatio);
    updateGuageChart("conquer-ratio-chart-container", "Conquer Ratio", conquerRatio);
    drawTimeSeriesChart("daily-score-chart", DAILY_SCORE_MODE);
    drawTimeSeriesChart("monthly-score-chart", MONTHLY_SCORE_MODE);
    drawTimeSeriesChart("yearly-score-chart", YEARLY_SCORE_MODE);
    drawTimeSeriesChart("dark_days_chart", DARK_DAYS_MODE);
    drawTimeSeriesChart("light_days_chart", LIGHT_DAYS_MODE);
    drawKhatmaPieChart();
    drawMemorizationPieChart();
    drawTreeMapChart("treemap-chart");
}