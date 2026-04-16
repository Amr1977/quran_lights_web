function drawStreakHistoryChart() {
    var divID = "streak-history-chart";
    var container = document.getElementById(divID);
    
    if (!container) {
        return;
    }
    
    if (typeof Highcharts === 'undefined') {
        container.innerHTML = '<p style="text-align:center;color:#666;">Loading chart library...</p>';
        return;
    }
    
    var surasHistory = get_local_storage_object("surasHistory") || {};

    if (!surasHistory || Object.keys(surasHistory).length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">No data yet</p>';
        return;
    }
    
    var periods = getStreakPeriods(surasHistory);

    if (!periods || periods.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">No streak data yet</p>';
        return;
    }

    var chartData = [];
    for (var i = 0; i < periods.length; i++) {
        var p = periods[i];
        if (p && p.startDate && p.length) {
            var startDate = new Date(p.startDate);
            var startTimestamp = startDate.getTime();
            chartData.push([startTimestamp, p.length]);
        }
    }

    if (chartData.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">No streak data</p>';
        return;
    }

    try {
        Highcharts.chart(divID, {
            chart: {
                type: 'column',
                zoomType: 'x'
            },
            title: {
                text: 'Streak History'
            },
            subtitle: {
                text: document.ontouchstart === undefined
                    ? "Click and drag in the plot area to zoom in"
                    : "Pinch the chart to zoom in"
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Streak Start Date'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Streak Duration (days)'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                    colorByPoint: false,
                    colors: ['#f97316', '#ea580c', '#eab308', '#ca8a04'],
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [{
                name: 'Streak Duration',
                data: chartData,
                color: '#f97316'
            }]
        });
    } catch (e) {
        console.error('Streak chart error:', e);
    }
}
