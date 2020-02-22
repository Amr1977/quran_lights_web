//Settings
var refreshPeriodDays = 10;

/**
 * Used to record the most recent transaction timestamp so in the next fetch we get more recent transactions only.
 */
var lastTransactionTimeStamp = "0";

var update_stamp = 0;
var serverOffset = 0;
var lightRatio = 0;
var conquerRatio = 0;
var autoRefreshPeriod = 6 * 60 * 60 * 1000;

var dark_days_map = new Map();//{year_month_key: set_of_light_days_value}

var surasColorTable = [];
var selected_suras = [];

var sort_order = localStorage.sort_order ? localStorage.sort_order : SORT_ORDER_NORMAL;