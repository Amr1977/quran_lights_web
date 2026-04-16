function drawStreakHistoryChart() {
    var divID = "streak-history-chart";
    var container = document.getElementById(divID);
    
    if (!container) {
        console.warn('Streak chart container not found');
        return;
    }
    
    if (typeof Highcharts === 'undefined') {
        container.innerHTML = '<p style="text-align:center;color:#666;">Loading chart...</p>';
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
                type: 'column'
            },
            title: {
                text: 'Streak History'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Days'
                }
            },
            series: [{
                name: 'Streak',
                data: chartData,
                color: '#f97316'
            }]
        });
    } catch (e) {
        console.error('Chart error:', e);
    }
}
