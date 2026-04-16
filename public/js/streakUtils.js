/**
 * Streak Utilities for Quran Lights
 * Pure functions for calculating review streaks from surasHistory
 */

function timestampToLocalDateString(timestamp) {
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + "-" + month + "-" + day;
}

function getUniqueReviewDates(surasHistory) {
    var dates = new Set();
    for (var suraIndex in surasHistory) {
        var history = surasHistory[suraIndex].history || [];
        for (var i = 0; i < history.length; i++) {
            var dateStr = timestampToLocalDateString(history[i]);
            dates.add(dateStr);
        }
    }
    return Array.from(dates).sort();
}

function getSortedUniqueDates(surasHistory) {
    var dates = getUniqueReviewDates(surasHistory);
    return dates.sort();
}

function dateToTimestamp(dateStr) {
    return new Date(dateStr).getTime();
}

function isConsecutiveDay(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    var diffTime = d2 - d1;
    var diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
}

function calculateCurrentStreak(surasHistory) {
    var dates = getSortedUniqueDates(surasHistory);
    if (dates.length === 0) return 0;

    var now = new Date();
    var today = timestampToLocalDateString(now.getTime() / 1000);
    var yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayStr = timestampToLocalDateString(yesterday.getTime() / 1000);

    var hasEntryToday = dates.indexOf(today) !== -1;
    var hasEntryYesterday = dates.indexOf(yesterdayStr) !== -1;

    if (!hasEntryToday && !hasEntryYesterday) {
        return 0;
    }

    var streak = 0;
    var currentDate = hasEntryToday ? today : yesterdayStr;

    while (dates.indexOf(currentDate) !== -1) {
        streak++;
        var prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        var prevYear = prevDate.getFullYear();
        var prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
        var prevDay = String(prevDate.getDate()).padStart(2, '0');
        currentDate = prevYear + "-" + prevMonth + "-" + prevDay;
    }

    return streak;
}

function calculateLongestStreak(surasHistory) {
    var dates = getSortedUniqueDates(surasHistory);
    if (dates.length === 0) return 0;

    var longestStreak = 1;
    var currentStreak = 1;

    for (var i = 1; i < dates.length; i++) {
        if (isConsecutiveDay(dates[i - 1], dates[i])) {
            currentStreak++;
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
        } else {
            currentStreak = 1;
        }
    }

    return longestStreak;
}

function getStreakHistory(surasHistory, numberOfDays) {
    numberOfDays = numberOfDays || 14;
    var dates = getSortedUniqueDates(surasHistory);
    var dateSet = new Set(dates);

    var result = [];
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    for (var i = numberOfDays - 1; i >= 0; i--) {
        var date = new Date(today);
        date.setDate(date.getDate() - i);
        var dateStr = timestampToLocalDateString(date.getTime() / 1000);
        result.push({
            date: dateStr,
            hasEntry: dateSet.has(dateStr)
        });
    }

    return result;
}

function isStreakBroken(surasHistory) {
    var dates = getSortedUniqueDates(surasHistory);
    if (dates.length === 0) return false;

    var now = new Date();
    var today = timestampToLocalDateString(now.getTime() / 1000);
    var yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayStr = timestampToLocalDateString(yesterday.getTime() / 1000);

    var hasEntryToday = dates.indexOf(today) !== -1;
    var hasEntryYesterday = dates.indexOf(yesterdayStr) !== -1;

    return !hasEntryToday && !hasEntryYesterday;
}

function hasAnyHistory(surasHistory) {
    for (var suraIndex in surasHistory) {
        var history = surasHistory[suraIndex].history || [];
        if (history.length > 0) return true;
    }
    return false;
}

function getStreakPeriods(surasHistory) {
    var dates = getSortedUniqueDates(surasHistory);
    if (dates.length === 0) return [];

    var periods = [];
    var currentPeriod = {
        startDate: dates[0],
        endDate: dates[0],
        length: 1
    };

    for (var i = 1; i < dates.length; i++) {
        if (isConsecutiveDay(dates[i - 1], dates[i])) {
            currentPeriod.endDate = dates[i];
            currentPeriod.length++;
        } else {
            periods.push(currentPeriod);
            currentPeriod = {
                startDate: dates[i],
                endDate: dates[i],
                length: 1
            };
        }
    }
    periods.push(currentPeriod);

    return periods;
}

function getMilestones() {
    return [3, 7, 14, 30, 60, 100, 365];
}

function checkAndCelebrateMilestone(currentStreak) {
    var milestones = getMilestones();
    var key = (typeof myUserId !== 'undefined' ? myUserId : 'anonymous') + "_celebrated_milestones";
    var celebrated = get_local_storage_object(key) || [];

    for (var i = 0; i < milestones.length; i++) {
        var m = milestones[i];
        if (currentStreak >= m && celebrated.indexOf(m) === -1) {
            celebrated.push(m);
            set_local_storage_object(key, celebrated);
            showToast("🎉 " + m + " day streak! Keep it up!");
            return true;
        }
    }
    return false;
}
