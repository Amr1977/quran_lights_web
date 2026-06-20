function drawStreakLineChart() {
    var divID = "streak-line-chart";
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

    var dates = getSortedUniqueDates(surasHistory);

    if (dates.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">No streak data yet</p>';
        return;
    }

    var dateSet = new Set(dates);
    var firstDate = new Date(dates[0]);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var chartData = [];
    var currentDate = new Date(firstDate);
    var runningStreak = 0;

    while (currentDate <= today) {
        var dateStr = formatDate(currentDate);
        var timestamp = currentDate.getTime();

        if (dateSet.has(dateStr)) {
            runningStreak++;
        } else {
            runningStreak = 0;
        }

        chartData.push([timestamp, runningStreak]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    if (chartData.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">No streak data</p>';
        return;
    }

    try {
        Highcharts.chart(divID, {
            chart: {
                type: 'area',
                zoomType: 'x'
            },
            title: {
                text: 'Streak Length Over Time'
            },
            subtitle: {
                text: document.ontouchstart === undefined
                    ? "Click and drag in the plot area to zoom in"
                    : "Pinch the chart to zoom in"
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Streak Length (days)'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#22c55e'],
                            [1, 'rgba(34,197,94,0)']
                        ]
                    },
                    marker: {
                        radius: 2,
                        enabledThreshold: 30
                    },
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            tooltip: {
                pointFormat: 'Streak: <b>{point.y} day(s)</b>'
            },
            series: [{
                name: 'Streak Length',
                data: chartData,
                color: '#22c55e'
            }]
        });
    } catch (e) {
        console.error('Streak line chart error:', e);
    }
}
