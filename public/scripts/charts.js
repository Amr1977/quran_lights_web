function update_charts() {
    updateGuageChart("light-ratio-chart-container", "Light Ratio", lightRatio);
    updateGuageChart("conquer-ratio-chart-container", "Conquer Ratio", conquerRatio);
    //drawTimeSeriesChart("daily-score-chart", 0);
    //drawTimeSeriesChart("monthly-score-chart", 1);
    //drawTimeSeriesChart("yearly-score-chart", 2);
    drawTimeSeriesChart("dark_days_chart", 3);
    //drawKhatmaPieChart();
    //drawMemorizationPieChart();
    //drawTreeMapChart("treemap-chart");
}