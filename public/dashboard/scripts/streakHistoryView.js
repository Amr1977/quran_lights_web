var streakHistoryModalOpen = false;

function renderStreakHistoryModal() {
    if (streakHistoryModalOpen) return;
    streakHistoryModalOpen = true;
    
    var surasHistory = get_local_storage_object("surasHistory") || {};
    var summary = getStreakSummary(surasHistory);
    var dailyCounts = getDailyEntryCounts(surasHistory);
    var segments = getAllStreakSegments(surasHistory);
    
    var modalHTML = '<div id="streak-history-modal" style="'
        + 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; '
        + 'background: rgba(0,0,0,0.85); z-index: 10000; '
        + 'display: flex; align-items: center; justify-content: center; '
        + 'padding: 10px; overflow-y: auto;">';
    
    modalHTML += '<div id="streak-history-container" style="'
        + 'background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); '
        + 'border-radius: 16px; padding: 20px; max-width: 900px; width: 100%; '
        + 'color: white; font-family: Cairo, Tahoma, sans-serif; position: relative; '
        + 'max-height: 90vh; overflow-y: auto;">';
    
    modalHTML += '<button id="close-streak-history" style="'
        + 'position: absolute; top: 10px; right: 10px; '
        + 'background: rgba(255,255,255,0.1); border: none; color: white; '
        + 'font-size: 24px; width: 40px; height: 40px; border-radius: 50%; '
        + 'cursor: pointer; display: flex; align-items: center; justify-content: center; '
        + 'z-index: 10;">&times;</button>';
    
    modalHTML += '<div style="text-align: center; margin-bottom: 15px; padding-right: 30px;">';
    modalHTML += '<h2 style="margin: 0 0 8px; font-size: 20px;">📊 Quran Review History</h2>';
    modalHTML += '<p style="margin: 0; opacity: 0.7; font-size: 13px;">Review your behavioral patterns</p>';
    modalHTML += '</div>';
    
    modalHTML += renderSummaryStats(summary);
    modalHTML += renderHeatmap(dailyCounts);
    modalHTML += renderStreakTimeline(segments);
    modalHTML += renderExportButtons();
    
    modalHTML += '</div></div>';
    
    modalHTML += '<style>'
        + '@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }'
        + '#streak-history-container { animation: fadeIn 0.3s ease-out; }'
        + '@media (max-width: 480px) {'
        + '  #streak-history-container { padding: 15px; border-radius: 12px; }'
        + '  #streak-history-container h2 { font-size: 18px !important; }'
        + '  .stat-card { padding: 10px !important; }'
        + '  .stat-card .stat-value { font-size: 20px !important; }'
        + '  .stat-card .stat-label { font-size: 10px !important; }'
        + '  .heatmap-day { width: 10px !important; height: 10px !important; }'
        + '  .export-btn { padding: 10px 16px !important; font-size: 12px !important; }'
        + '  .export-btns { gap: 8px !important; }'
        + '}'
        + '</style>';
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('close-streak-history').addEventListener('click', closeStreakHistoryModal);
    document.getElementById('streak-history-modal').addEventListener('click', function(e) {
        if (e.target.id === 'streak-history-modal') {
            closeStreakHistoryModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeStreakHistoryModal();
        }
    });
}

function closeStreakHistoryModal() {
    var modal = document.getElementById('streak-history-modal');
    if (modal) {
        modal.remove();
    }
    streakHistoryModalOpen = false;
}

function renderSummaryStats(summary) {
    var html = '<div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px;">';
    
    html += renderStatCard('🔥', summary.currentWhite, 'Current Streak', 'stat-card');
    html += renderStatCard('⬛', summary.currentBlack, 'Current Gap', 'stat-card');
    html += renderStatCard('🏆', summary.longestWhite, 'Best Streak', 'stat-card');
    html += renderStatCard('💀', summary.longestBlack, 'Longest Gap', 'stat-card');
    html += renderStatCard('📊', summary.totalActiveDays + ' / ' + summary.totalDays, 'Active Days', 'stat-card');
    html += renderStatCard('📅', summary.trackingSince || 'N/A', 'Tracking Since', 'stat-card');
    
    html += '</div>';
    return html;
}

function renderStatCard(icon, value, label, className) {
    return '<div class="' + className + '" style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 10px; text-align: center;">'
        + '<div style="font-size: 22px;">' + icon + '</div>'
        + '<div class="stat-value" style="font-size: 22px; font-weight: bold;">' + value + '</div>'
        + '<div class="stat-label" style="font-size: 11px; opacity: 0.7; word-wrap: break-word;">' + label + '</div>'
        + '</div>';
}

function renderHeatmap(dailyCounts) {
    var html = '<div style="margin-bottom: 20px; overflow-x: auto; -webkit-overflow-scrolling: touch;">';
    html += '<h3 style="margin: 0 0 12px; font-size: 16px;">Yearly Activity</h3>';
    
    var today = new Date();
    var startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    
    while (startDate.getDay() !== 6) {
        startDate.setDate(startDate.getDate() - 1);
    }
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var monthLabels = {};
    var currentMonth = -1;
    
    html += '<div style="display: flex; gap: 2px;">';
    html += '<div style="display: flex; flex-direction: column; gap: 2px; margin-right: 4px; font-size: 9px; color: #9ca3af; line-height: 1.2;">';
    html += '<div style="height: 10px;"></div>';
    html += '<div>Sat</div><div style="height: 8px;"></div>';
    html += '<div>Mon</div><div style="height: 8px;"></div>';
    html += '<div>Wed</div><div style="height: 8px;"></div>';
    html += '<div>Fri</div>';
    html += '</div>';
    
    html += '<div style="flex: 1; min-width: 500px;">';
    
    var weeks = [];
    var currentWeek = [];
    var currentDate = new Date(startDate);
    
    while (currentDate <= today) {
        var dayOfWeek = currentDate.getDay();
        var dateStr = formatDate(currentDate);
        var count = dailyCounts[dateStr] || 0;
        
        if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        
        var month = currentDate.getMonth();
        if (month !== currentMonth) {
            currentMonth = month;
            monthLabels[weeks.length] = months[month];
        }
        
        currentWeek.push({ date: dateStr, count: count, dayOfWeek: dayOfWeek });
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }
    
    html += '<div style="display: flex; gap: 2px; margin-bottom: 5px;">';
    for (var w = 0; w < weeks.length; w++) {
        if (monthLabels[w]) {
            html += '<div style="font-size: 9px; color: #9ca3af; width: 12px;">' + monthLabels[w] + '</div>';
        }
    }
    html += '</div>';
    
    html += '<div style="display: flex; gap: 2px;">';
    for (var w = 0; w < weeks.length; w++) {
        html += '<div style="display: flex; flex-direction: column; gap: 2px;">';
        for (var d = 0; d < 7; d++) {
            var dayData = weeks[w][d];
            if (dayData) {
                var color = getHeatmapColor(dayData.count);
                var isToday = dayData.date === formatDate(new Date());
                var border = isToday ? '2px solid #f97316' : 'none';
                html += '<div class="heatmap-day" data-date="' + dayData.date + '" data-count="' + dayData.count + '" '
                    + 'style="width: 12px; height: 12px; background: ' + color + '; border-radius: 2px; border: ' + border + '; cursor: pointer; min-width: 12px; min-height: 12px;" '
                    + 'title="' + dayData.date + ' - ' + (dayData.count > 0 ? dayData.count + ' Surah(s)' : 'No entries') + '"></div>';
            } else {
                html += '<div style="width: 12px; height: 12px; min-width: 12px; min-height: 12px;"></div>';
            }
        }
        html += '</div>';
    }
    html += '</div>';
    
    html += '</div></div>';
    
    html += '<div style="display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 11px; color: #9ca3af; justify-content: center; flex-wrap: wrap;">';
    html += '<span>Less</span>';
    html += '<div style="width: 10px; height: 10px; background: #1f2937; border-radius: 2px;"></div>';
    html += '<div style="width: 10px; height: 10px; background: #bbf7d0; border-radius: 2px;"></div>';
    html += '<div style="width: 10px; height: 10px; background: #4ade80; border-radius: 2px;"></div>';
    html += '<div style="width: 10px; height: 10px; background: #16a34a; border-radius: 2px;"></div>';
    html += '<div style="width: 10px; height: 10px; background: #14532d; border-radius: 2px;"></div>';
    html += '<span>More</span>';
    html += '</div>';
    
    html += '</div>';
    return html;
}

function getHeatmapColor(count) {
    if (count === 0) return '#1f2937';
    if (count === 1) return '#bbf7d0';
    if (count <= 3) return '#4ade80';
    if (count <= 6) return '#16a34a';
    return '#14532d';
}

function renderStreakTimeline(segments) {
    if (!segments || segments.length === 0) return '';
    
    var html = '<div style="margin-bottom: 20px;">';
    html += '<h3 style="margin: 0 0 12px; font-size: 16px;">Streak Timeline</h3>';
    html += '<div style="display: flex; height: 24px; border-radius: 4px; overflow: hidden;">';
    
    var totalDays = 0;
    for (var i = 0; i < segments.length; i++) {
        totalDays += segments[i].days;
    }
    
    for (var i = 0; i < segments.length; i++) {
        var seg = segments[i];
        var width = (seg.days / totalDays) * 100;
        var color = seg.type === 'white' ? '#4ade80' : '#1f2937';
        html += '<div class="timeline-segment" data-type="' + seg.type + '" data-days="' + seg.days + '" data-start="' + seg.startDate + '" data-end="' + seg.endDate + '" '
            + 'style="width: ' + width + '%; background: ' + color + '; cursor: pointer; min-width: 2px;" '
            + 'title="' + (seg.type === 'white' ? 'White' : 'Black') + ' streak: ' + seg.days + ' days (' + seg.startDate + ' → ' + seg.endDate + ')"></div>';
    }
    
    html += '</div>';
    html += '<div style="display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; margin-top: 5px; flex-wrap: wrap; gap: 5px;">';
    html += '<span>🟢 White = Review days</span>';
    html += '<span>⬛ Black = No entries</span>';
    html += '</div>';
    html += '</div>';
    
    return html;
}

function renderExportButtons() {
    var html = '<div class="export-btns" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">';
    
    html += '<button class="export-btn" onclick="exportStreakImage()" style="'
        + 'background: #3b82f6; color: white; border: none; padding: 12px 20px; '
        + 'border-radius: 8px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px; '
        + 'min-height: 44px;">';
    html += '📷 Export Image';
    html += '</button>';
    
    html += '<button class="export-btn" onclick="exportStreakPDF()" style="'
        + 'background: #ef4444; color: white; border: none; padding: 12px 20px; '
        + 'border-radius: 8px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px; '
        + 'min-height: 44px;">';
    html += '📄 Export PDF';
    html += '</button>';
    
    html += '<button class="export-btn" onclick="generateShareableLink()" style="'
        + 'background: #8b5cf6; color: white; border: none; padding: 12px 20px; '
        + 'border-radius: 8px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px; '
        + 'min-height: 44px;">';
    html += '🔗 Share Link';
    html += '</button>';
    
    html += '</div>';
    return html;
}

function exportStreakImage() {
    if (typeof html2canvas === 'undefined') {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', function() {
            doExportImage();
        });
    } else {
        doExportImage();
    }
}

function doExportImage() {
    var element = document.getElementById('streak-history-container');
    html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true
    }).then(function(canvas) {
        var link = document.createElement('a');
        link.download = 'quran-streak-' + getTodayDateString() + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Image exported successfully!');
    }).catch(function(err) {
        console.error('Export error:', err);
        showToast('Export failed. Please try again.');
    });
}

function exportStreakPDF() {
    if (typeof html2canvas === 'undefined') {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', function() {
            doExportPDF();
        });
    } else {
        doExportPDF();
    }
}

function doExportPDF() {
    var element = document.getElementById('streak-history-container');
    html2canvas(element, { scale: 2, backgroundColor: '#0f172a' }).then(function(canvas) {
        var imgData = canvas.toDataURL('image/png');
        var pdf = new jspdf.jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width / 2, canvas.height / 2]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save('quran-streak-' + getTodayDateString() + '.pdf');
        showToast('PDF exported successfully!');
    }).catch(function(err) {
        console.error('PDF export error:', err);
        showToast('PDF export failed. Please try again.');
    });
}

function generateShareableLink() {
    if (typeof firebase === 'undefined' || !firebase.auth().currentUser) {
        showToast('Please sign in to share');
        return;
    }
    
    var surasHistory = get_local_storage_object("surasHistory") || {};
    var summary = getStreakSummary(surasHistory);
    var dailyCounts = getDailyEntryCounts(surasHistory);
    var segments = getAllStreakSegments(surasHistory);
    
    var user = firebase.auth().currentUser;
    var displayName = user.displayName || user.email || 'Anonymous';
    
    var snapshot = {
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000),
        summary: summary,
        dailyCounts: dailyCounts,
        segments: segments,
        displayName: displayName
    };
    
    firebase.database().ref('streakSnapshots').push(snapshot).then(function(ref) {
        var shareUrl = window.location.origin + '/streak-share.html?id=' + ref.key;
        promptShareLink(shareUrl);
    }).catch(function(error) {
        console.error('Share error:', error);
        showToast('Failed to generate link. Please try again.');
    });
}

function promptShareLink(url) {
    var html = '<div id="share-link-modal" style="'
        + 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; '
        + 'background: rgba(0,0,0,0.9); z-index: 10001; '
        + 'display: flex; align-items: center; justify-content: center; padding: 20px;">';
    
    html += '<div style="'
        + 'background: #1e293b; border-radius: 16px; padding: 25px; max-width: 400px; width: 100%; '
        + 'color: white; font-family: Cairo, Tahoma, sans-serif; text-align: center;">';
    
    html += '<h3 style="margin: 0 0 15px; font-size: 18px;">🔗 Share Link Created!</h3>';
    html += '<p style="opacity: 0.7; margin-bottom: 15px; font-size: 13px;">Link expires in 30 days</p>';
    
    html += '<input type="text" id="share-url-input" value="' + url + '" readonly style="'
        + 'width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #374151; '
        + 'background: #0f172a; color: white; margin-bottom: 15px; box-sizing: border-box; font-size: 12px;">';
    
    html += '<div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">';
    html += '<button onclick="copyShareLink()" style="'
        + 'background: #3b82f6; color: white; border: none; padding: 12px 20px; '
        + 'border-radius: 8px; cursor: pointer; min-height: 44px;">📋 Copy Link</button>';
    
    html += '<button onclick="document.getElementById(\'share-link-modal\').remove()" style="'
        + 'background: #374151; color: white; border: none; padding: 12px 20px; '
        + 'border-radius: 8px; cursor: pointer; min-height: 44px;">Close</button>';
    html += '</div></div></div>';
    
    document.body.insertAdjacentHTML('beforeend', html);
}

function copyShareLink() {
    var input = document.getElementById('share-url-input');
    input.select();
    document.execCommand('copy');
    showToast('Link copied to clipboard!');
}

function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
}

window.renderStreakHistoryModal = renderStreakHistoryModal;
window.exportStreakImage = exportStreakImage;
window.exportStreakPDF = exportStreakPDF;
window.generateShareableLink = generateShareableLink;
window.copyShareLink = copyShareLink;
