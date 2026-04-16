function drawStreakHistoryChart() {
    console.log('[StreakChart] drawStreakHistoryChart called');
    
    var divID = "streak-history-chart";
    var container = document.getElementById(divID);
    
    console.log('[StreakChart] Container element:', container);
    console.log('[StreakChart] Highcharts:', typeof Highcharts);
    
    if (!container) {
        console.error('[StreakChart] Container NOT FOUND:', divID);
        // Try to find all elements with streak in ID
        var allDivs = document.querySelectorAll('[id*="streak"]');
        console.log('[StreakChart] Elements with streak in ID:', allDivs);
        return;
    }
    
    if (typeof Highcharts === 'undefined') {
        console.warn('[StreakChart] Highcharts not loaded yet');
        container.innerHTML = '<p style="text-align:center;color:#666;">Loading chart library...</p>';
        return;
    }
    
    var surasHistory = get_local_storage_object("surasHistory") || {};
    console.log('[StreakChart] surasHistory keys:', Object.keys(surasHistory).length);

    if (!surasHistory || Object.keys(surasHistory).length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">No data yet</p>';
        return;
    }
    
    var periods = getStreakPeriods(surasHistory);
    console.log('[StreakChart] periods:', periods);

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

    console.log('[StreakChart] chartData:', chartData);

    if (chartData.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">No streak data</p>';
        return;
    }

    try {
        console.log('[StreakChart] Creating chart...');
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
        console.log('[StreakChart] Chart created successfully');
    } catch (e) {
        console.error('[StreakChart] Error:', e);
    }
}

// Auto-run for debugging when script loads
console.log('[StreakChart] Script loaded, function defined');
