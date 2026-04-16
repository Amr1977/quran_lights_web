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
        + 'padding: 15px; '
        + 'margin: 8px; '
        + 'color: white; '
        + 'font-family: Cairo, Tahoma, sans-serif; '
        + 'animation: fadeInUp 0.5s ease-out;'
        + '">';
    
    widgetHTML += '<div class="streak-stats" style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 10px;">';
    
    widgetHTML += '<div class="streak-current" style="text-align: center; flex: 1; min-width: 100px;">';
    widgetHTML += '<div style="font-size: 36px; color: ' + streakColor + '; font-weight: bold; line-height: 1;">';
    widgetHTML += '🔥 ' + currentStreak;
    widgetHTML += '</div>';
    widgetHTML += '<div style="font-size: 12px; opacity: 0.8;">' + t('daysStreak') + '</div>';
    widgetHTML += '</div>';
    
    widgetHTML += '<div class="streak-best" style="text-align: center; flex: 1; min-width: 100px;">';
    widgetHTML += '<div style="font-size: 24px; color: #fbbf24; line-height: 1.2;">🏆 ' + longestStreak + '</div>';
    widgetHTML += '<div style="font-size: 11px; opacity: 0.7;">' + t('bestStreak') + '</div>';
    if (isNewRecord) {
        widgetHTML += '<div style="font-size: 11px; color: #34d399; margin-top: 2px;">✨ ' + t('newRecord') + '</div>';
    }
    widgetHTML += '</div>';
    
    widgetHTML += '</div>';
    
    widgetHTML += '<div class="streak-heatmap" style="margin-top: 12px;">';
    widgetHTML += '<div style="font-size: 11px; opacity: 0.7; margin-bottom: 6px; text-align: center;">' + t('last14Days') + ':</div>';
    widgetHTML += '<div style="display: flex; gap: 4px; justify-content: center; flex-wrap: wrap;">';
    
    for (var i = 0; i < streakHistory.length; i++) {
        var day = streakHistory[i];
        var isToday = i === streakHistory.length - 1;
        var bgColor = day.hasEntry ? streakColor : 'rgba(255,255,255,0.1)';
        var borderStyle = isToday ? '2px solid ' + streakColor : 'none';
        
        widgetHTML += '<div class="heatmap-dot" style="'
            + 'width: 16px; height: 16px; '
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
        widgetHTML += '<div class="streak-broken" style="margin-top: 12px; padding: 8px; background: rgba(239, 68, 68, 0.2); border-radius: 8px; text-align: center; font-size: 12px;">';
        widgetHTML += '😢 ' + t('lastStreak') + ' ' + lastStreak + ' ' + t('days') + ' — ' + t('startNew') + ' 🌱';
        widgetHTML += '</div>';
    }
    
    widgetHTML += '<div class="streak-actions" style="text-align: center; margin-top: 12px;">';
    widgetHTML += '<button id="open-streak-history" style="'
        + 'background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); '
        + 'padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; '
        + 'min-height: 36px;">';
    widgetHTML += '📊 View Full History</button>';
    widgetHTML += '</div>';
    
    widgetHTML += '</div>';
    
    widgetHTML += '<style>'
        + '@keyframes fadeInUp {'
        + 'from { opacity: 0; transform: translateY(10px); }'
        + 'to { opacity: 1; transform: translateY(0); }'
        + '}'
        + '@media (max-width: 480px) {'
        + '  #streak-widget { padding: 12px !important; margin: 6px !important; }'
        + '  .streak-current div:first-child { font-size: 28px !important; }'
        + '  .streak-best div:first-child { font-size: 20px !important; }'
        + '  .heatmap-dot { width: 14px !important; height: 14px !important; }'
        + '  #open-streak-history { font-size: 11px !important; padding: 6px 12px !important; }'
        + '}'
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
    
    setTimeout(function() {
        var historyBtn = document.getElementById('open-streak-history');
        if (historyBtn) {
            historyBtn.addEventListener('click', function() {
                if (typeof renderStreakHistoryModal === 'function') {
                    renderStreakHistoryModal();
                }
            });
        }
    }, 100);
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
                console.log('[StreakWidget] Cleaned ' + cleaned + ' old entries from localStorage');
            }
        }
        
        if (typeof cleanupOldFirebaseEntries === 'function') {
            cleanupOldFirebaseEntries(function(fbCleaned) {
                if (fbCleaned > 0) {
                    console.log('[StreakWidget] Cleaned ' + fbCleaned + ' old entries from Firebase');
                }
            });
        }
        
        var surasHistory = get_local_storage_object("surasHistory");
        
        if (surasHistory && typeof calculateCurrentStreak === 'function') {
            renderStreakWidget();
        } else if (typeof calculateCurrentStreak === 'function') {
            renderStreakWidget();
        }
        
        streakWidgetInitialized = true;
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
