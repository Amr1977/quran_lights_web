/*
* Author: Amr Lotfy 2020
*/

//var refreshPeriodDays = get_initial_local_object("refreshPeriodDays", MAX_ELAPSED_DAYS_FOR_MEMORIZED_SURAS);

function get_refresh_period_days() {
    return get_initial_local_object("refreshPeriodDays", MAX_ELAPSED_DAYS_FOR_MEMORIZED_SURAS);
};

function set_refresh_period_days(value) {
    if (!value) return;
    //refreshPeriodDays = value;
    set_local_storage_object("refreshPeriodDays", value);
}

/**
 * Used to record the most recent transaction timestamp so in the next fetch we get more recent transactions only.
 */
var lastTransactionTimeStamp = "0";

var update_stamp = 0;
var serverOffset = 0;
var lightRatio = 0;
var conquerRatio = 0;

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
var read_daily_target = 100_000;
var review_daily_target = 100_000; 

var scores = {};
var memorization_state = {};