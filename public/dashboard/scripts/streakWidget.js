var streakWidgetInitialized = false;

function t(key) {
    if (window.i18n && window.i18n.translations && window.i18n.translations.dashboard) {
        return window.i18n.translations.dashboard[key] || key;
    }
    var translations = {
        ar: {
            daysStreak: 'أيام متتالية',
            bestStreak: 'أفضل سلسلة',
            newRecord: 'سجل جديد!',
            lastStreak: 'آخر سلسلة كانت',
            days: 'أيام',
            startNew: 'ابدأ جديدة اليوم!',
            last14Days: 'آخر 14 يوم'
        },
        en: {
            daysStreak: 'days streak',
            bestStreak: 'Best Streak',
            newRecord: 'New Record!',
            lastStreak: 'Your last streak was',
            days: 'days',
            startNew: 'Start a new one today!',
            last14Days: 'Last 14 days'
        }
    };
    var lang = localStorage.getItem('quran_lights_language') || 'ar';
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
}

function renderStreakWidget() {
    var surasHistory = get_local_storage_object("surasHistory") || {};
    
    var currentStreak = calculateCurrentStreak(surasHistory);
    var longestStreak = calculateLongestStreak(surasHistory);
    var hasHistory = hasAnyHistory(surasHistory);
    var isBroken = isStreakBroken(surasHistory);
    var streakHistory = getStreakHistory(surasHistory, 14);
    
    var streakColor = getStreakColor(currentStreak);
    var isNewRecord = currentStreak >= longestStreak && currentStreak > 0;
    
    var widgetHTML = '<div id="streak-widget" style="'
        + 'background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); '
        + 'border-radius: 12px; '
        + 'padding: 20px; '
        + 'margin: 10px; '
        + 'color: white; '
        + 'font-family: Cairo, Tahoma, sans-serif; '
        + 'animation: fadeInUp 0.5s ease-out;'
        + '">';
    
    widgetHTML += '<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">';
    
    widgetHTML += '<div style="text-align: center;">';
    widgetHTML += '<div style="font-size: 48px; color: ' + streakColor + '; font-weight: bold;">';
    widgetHTML += '🔥 ' + currentStreak;
    widgetHTML += '</div>';
    widgetHTML += '<div style="font-size: 14px; opacity: 0.8;">' + t('daysStreak') + '</div>';
    widgetHTML += '</div>';
    
    widgetHTML += '<div style="text-align: center;">';
    widgetHTML += '<div style="font-size: 28px; color: #fbbf24;">🏆 ' + longestStreak + '</div>';
    widgetHTML += '<div style="font-size: 12px; opacity: 0.7;">' + t('bestStreak') + '</div>';
    if (isNewRecord) {
        widgetHTML += '<div style="font-size: 12px; color: #34d399; margin-top: 4px;">✨ ' + t('newRecord') + '</div>';
    }
    widgetHTML += '</div>';
    
    widgetHTML += '</div>';
    
    widgetHTML += '<div style="margin-top: 15px;">';
    widgetHTML += '<div style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">' + t('last14Days') + ':</div>';
    widgetHTML += '<div style="display: flex; gap: 6px; justify-content: center;">';
    
    for (var i = 0; i < streakHistory.length; i++) {
        var day = streakHistory[i];
        var isToday = i === streakHistory.length - 1;
        var bgColor = day.hasEntry ? streakColor : 'rgba(255,255,255,0.1)';
        var borderStyle = isToday ? '2px solid ' + streakColor : 'none';
        
        widgetHTML += '<div style="'
            + 'width: 20px; height: 20px; '
            + 'border-radius: 50%; '
            + 'background: ' + bgColor + '; '
            + 'border: ' + borderStyle + '; '
            + 'cursor: pointer;'
            + '" title="' + day.date + ' (' + (day.hasEntry ? '✓' : '✗') + ')">';
        widgetHTML += '</div>';
    }
    
    widgetHTML += '</div></div>';
    
    if (currentStreak === 0 && hasHistory && isBroken) {
        var lastStreak = longestStreak;
        widgetHTML += '<div style="margin-top: 15px; padding: 10px; background: rgba(239, 68, 68, 0.2); border-radius: 8px; text-align: center;">';
        widgetHTML += '😢 ' + t('lastStreak') + ' ' + lastStreak + ' ' + t('days') + ' — ' + t('startNew') + ' 🌱';
        widgetHTML += '</div>';
    }
    
    widgetHTML += '</div>';
    
    widgetHTML += '<style>'
        + '@keyframes fadeInUp {'
        + 'from { opacity: 0; transform: translateY(10px); }'
        + 'to { opacity: 1; transform: translateY(0); }'
        + '}'
        + '@keyframes glow {'
        + '0%, 100% { box-shadow: 0 0 10px #eab308; }'
        + '50% { box-shadow: 0 0 20px #eab308, 0 0 30px #eab308; }'
        + '}'
        + '.streak-glow { animation: glow 2s ease-in-out infinite; }'
        + '</style>';
    
    var existingWidget = document.getElementById('streak-widget');
    if (existingWidget) {
        existingWidget.outerHTML = widgetHTML;
    } else {
        var scoreDiv = document.getElementById('score');
        if (scoreDiv && scoreDiv.parentElement) {
            var container = document.createElement('div');
            container.innerHTML = widgetHTML;
            scoreDiv.parentElement.insertBefore(container.firstChild, scoreDiv.nextSibling);
        }
    }
    
    checkAndCelebrateMilestone(currentStreak);
}

function getStreakColor(streak) {
    if (streak === 0) return '#9ca3af';
    if (streak >= 1 && streak <= 6) return '#f97316';
    if (streak >= 7 && streak <= 29) return '#ea580c';
    if (streak >= 30 && streak <= 99) return '#eab308';
    if (streak >= 100) return '#fbbf24';
    return '#9ca3af';
}

function initStreakWidget() {
    if (streakWidgetInitialized) return;
    
    var checkAndRender = function() {
        if (typeof cleanupOldEntries === 'function') {
            var cleaned = cleanupOldEntries();
            if (cleaned > 0) {
                console.log('[Streak] Cleaned ' + cleaned + ' old entries before 2014');
            }
        }
        
        var surasHistory = get_local_storage_object("surasHistory");
        if (surasHistory && typeof calculateCurrentStreak === 'function') {
            streakWidgetInitialized = true;
            renderStreakWidget();
        }
    };
    
    if (typeof get_local_storage_object === 'function') {
        checkAndRender();
    }
    
    setInterval(checkAndRender, 5000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initStreakWidget, 1000);
    });
} else {
    setTimeout(initStreakWidget, 1000);
}

document.addEventListener('suraRefreshed', function() {
    setTimeout(renderStreakWidget, 100);
});

if (window.i18n && window.i18n.translations) {
    window.addEventListener('languageChanged', function() {
        if (streakWidgetInitialized) {
            renderStreakWidget();
        }
    });
}
