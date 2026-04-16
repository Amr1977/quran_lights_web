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

var MIN_VALID_TIMESTAMP = 1388534400; // Jan 1, 2014 00:00:00 UTC

function filterOldEntries(surasHistory, minTimestamp) {
    minTimestamp = minTimestamp || MIN_VALID_TIMESTAMP;
    var filtered = {};
    for (var suraIndex in surasHistory) {
        var history = surasHistory[suraIndex].history || [];
        var validHistory = [];
        for (var i = 0; i < history.length; i++) {
            if (history[i] >= minTimestamp) {
                validHistory.push(history[i]);
            }
        }
        if (validHistory.length > 0 || surasHistory[suraIndex].memorization) {
            filtered[suraIndex] = {
                suraIndex: surasHistory[suraIndex].suraIndex,
                history: validHistory,
                memorization: surasHistory[suraIndex].memorization,
                memorization_date: surasHistory[suraIndex].memorization_date
            };
        }
    }
    return filtered;
}

function getInvalidEntryCount(surasHistory, minTimestamp) {
    minTimestamp = minTimestamp || MIN_VALID_TIMESTAMP;
    var count = 0;
    for (var suraIndex in surasHistory) {
        var history = surasHistory[suraIndex].history || [];
        for (var i = 0; i < history.length; i++) {
            if (history[i] < minTimestamp) {
                count++;
            }
        }
    }
    return count;
}

function cleanupOldEntries() {
    var surasHistory = get_local_storage_object("surasHistory") || {};
    var invalidCount = getInvalidEntryCount(surasHistory);
    
    if (invalidCount > 0) {
        var cleaned = filterOldEntries(surasHistory);
        set_local_storage_object("surasHistory", cleaned);
        console.log("[Streak] Cleaned " + invalidCount + " entries before 2014 from localStorage");
        return invalidCount;
    }
    return 0;
}

function cleanupOldFirebaseEntries(callback) {
    if (typeof firebase === 'undefined' || !firebase.auth().currentUser) {
        console.warn("[Streak] Firebase not available for cleanup");
        if (callback) callback(false);
        return;
    }
    
    var userId = firebase.auth().currentUser.uid;
    var reviewsRef = firebase.database().ref("users/" + userId + "/Master/reviews");
    
    reviewsRef.once('value', function(snapshot) {
        var data = snapshot.val();
        if (!data) {
            console.log("[Streak] No Firebase data to clean");
            if (callback) callback(0);
            return;
        }
        
        var updates = {};
        var deleteCount = 0;
        
        for (var key in data) {
            var entry = data[key];
            if (entry && entry.time && entry.time < MIN_VALID_TIMESTAMP) {
                updates[key] = null;
                deleteCount++;
            }
        }
        
        if (deleteCount > 0) {
            reviewsRef.update(updates).then(function() {
                console.log("[Streak] Cleaned " + deleteCount + " old entries from Firebase");
                if (callback) callback(deleteCount);
            }).catch(function(error) {
                console.error("[Streak] Firebase cleanup error:", error);
                if (callback) callback(false);
            });
        } else {
            console.log("[Streak] No old entries in Firebase to clean");
            if (callback) callback(0);
        }
    });
}
