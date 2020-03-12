/*
* Author: Amr Lotfy 2020
*/

var refreshPeriodDays = getLocalStorageObject("refreshPeriodDays") ? Number(getLocalStorageObject("refreshPeriodDays")) : 10;

function get_refresh_period_days() {
    return getLocalStorageObject("refreshPeriodDays") ? Number(getLocalStorageObject("refreshPeriodDays")) : 10;
};

function set_refresh_period_days(value) {
    if (!value) return;
    refreshPeriodDays = value;
    setLocalStorageObject("refreshPeriodDays", refreshPeriodDays);
}

/**
 * Used to record the most recent transaction timestamp so in the next fetch we get more recent transactions only.
 */
var lastTransactionTimeStamp = "0";

var update_stamp = 0;
var serverOffset = 0;
var lightRatio = 0;
var conquerRatio = 0;
var autoRefreshPeriod = 6 * 60 * 60 * 1000;

var surasColorTable = [];
var selected_suras = [];

var sort_order;

var state = {};
var myUserId;
var user;

var surasHistory = {};//TODO replace {} with new Map()
var sortedTimestampSuraArray = [];

var colorHash = {};
var elapsed_days = [];

var review_today = 0;