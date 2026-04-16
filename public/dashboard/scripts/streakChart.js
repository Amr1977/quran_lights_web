var streakChartInstance = null;

function t(key) {
    if (window.i18n && window.i18n.translations && window.i18n.translations.dashboard) {
        return window.i18n.translations.dashboard[key] || key;
    }
    var translations = {
        ar: {
            noStreakData: 'لا توجد بيانات بعد. ابدأ المراجعة لبناء سلاسل متتالية!',
            streakHistory: 'سجل السلسلة',
            streakHistorySubtitle: 'كل شريط يمثل فترة سلسلة (تاريخ البداية → المدة بالأيام)',
            streakStartDate: 'تاريخ بداية السلسلة',
            streakDuration: 'مدة السلسلة (أيام)',
            streak: 'سلسلة',
            start: 'البداية',
            duration: 'المدة',
            end: 'النهاية',
            days: 'أيام'
        },
        en: {
            noStreakData: 'No streak data yet. Start reviewing to build your streaks!',
            streakHistory: 'Streak History',
            streakHistorySubtitle: 'Each bar represents a streak period (start date → duration in days)',
            streakStartDate: 'Streak Start Date',
            streakDuration: 'Streak Duration (days)',
            streak: 'Streak',
            start: 'Start',
            duration: 'Duration',
            end: 'End',
            days: 'days'
        }
    };
    var lang = localStorage.getItem('quran_lights_language') || 'ar';
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
}

function drawStreakHistoryChart() {
    var divID = "streak-history-chart";
    var surasHistory = get_local_storage_object("surasHistory") || {};
    var periods = getStreakPeriods(surasHistory);

    if (periods.length === 0) {
        document.getElementById(divID).innerHTML = '<p style="text-align:center;color:#666;">' + t('noStreakData') + '</p>';
        return;
    }

    var chartData = [];
    for (var i = 0; i < periods.length; i++) {
        var p = periods[i];
        var startDate = new Date(p.startDate);
        var startTimestamp = startDate.getTime();
        chartData.push([startTimestamp, p.length]);
    }

    if (streakChartInstance) {
        streakChartInstance.destroy();
    }

    streakChartInstance = Highcharts.chart(divID, {
        chart: {
            type: 'column',
            style: {
                fontFamily: 'Cairo, Tahoma, sans-serif'
            }
        },
        title: {
            text: t('streakHistory')
        },
        subtitle: {
            text: t('streakHistorySubtitle')
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: t('streakStartDate')
            },
            labels: {
                format: '{value:%Y-%m-%d}'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: t('streakDuration')
            }
        },
        tooltip: {
            formatter: function() {
                var startDate = new Date(this.x);
                var endDate = new Date(this.point.endDate);
                return '<b>' + t('streak') + '</b><br/>' +
                       t('start') + ': ' + Highcharts.dateFormat('%Y-%m-%d', this.x) + '<br/>' +
                       t('duration') + ': <b>' + this.y + '</b> ' + t('days') + '<br/>' +
                       t('end') + ': ' + endDate.toISOString().split('T')[0];
            }
        },
        plotOptions: {
            column: {
                colorByPoint: false,
                colors: ['#f97316', '#ea580c', '#eab308', '#ca8a04'],
                dataLabels: {
                    enabled: true,
                    format: '{y} ' + t('days')
                }
            }
        },
        series: [{
            name: t('streakDuration'),
            data: chartData,
            color: '#f97316'
        }]
    });
}

function initStreakChart() {
    if (typeof Highcharts === 'undefined') {
        console.warn('Highcharts not loaded yet');
        return;
    }
    
    var tab = document.getElementById('streak_history_tab');
    if (tab) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.style.display !== 'none' && !mutation.target.classList.contains('streak-loaded')) {
                    mutation.target.classList.add('streak-loaded');
                    drawStreakHistoryChart();
                }
            });
        });
        observer.observe(tab, { attributes: true, attributeFilter: ['style'] });
    }
    
    if (document.getElementById('streak_history_tab').style.display !== 'none') {
        drawStreakHistoryChart();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initStreakChart, 500);
    });
} else {
    setTimeout(initStreakChart, 500);
}

if (window.i18n && window.i18n.translations) {
    window.addEventListener('languageChanged', function() {
        drawStreakHistoryChart();
    });
}
