function create_dark_days_map(start_date) {
  var dark_days = {};
  var today = new Date();
  var start_year = start_date.getFullYear();
  var start_month = start_date.getMonth() + 1;
  var start_day = start_date.getDate();
  var year_now = today.getFullYear();
  var month_now = today.getMonth() + 1;
  var day_now = today.getDate();

  for (var year_index = start_year; year_index <= year_now; year_index++) {
    for (var month_index = 1; month_index <= 12; month_index++) {
      if (year_index == start_year && month_index < start_month) {
        continue;
      }

      if (year_index == year_now && month_index > month_now) {
        continue;
      }

      var number_of_days_per_month = new Date(year_index, month_index, 0).getDate();
      var days_array = [];
      for (var day_index = 1; day_index <= number_of_days_per_month; day_index++) {
        if (year_index == start_year && month_index == start_month && day_index < start_day) {
          continue;
        }

        if (year_index == year_now && month_index == month_now && day_index > day_now) {
          continue;
        }

        days_array.push(day_index);

      }

      var light_days_key = year_index + "-" + month_index;
      
      dark_days[light_days_key] = days_array;
      ;
    }
  }

  return dark_days;
}

function dark_days_data() {

  var result = [];

  var sortedEntries = get_flat_timestamp_score_array();
  if (!sortedEntries || sortedEntries.length == 0) {
    return [];
  }
  var dark_days_map = create_dark_days_map(new Date(sortedEntries[0][0]));

  var prevMonth = new Date(sortedEntries[0][0]).getMonth() + 1;
  var prevYear = new Date(sortedEntries[0][0]).getFullYear();
  var year_month_key = prevYear + "-" + prevMonth;


  for (var index = 0; index < sortedEntries.length; index++) {
    var date = new Date(sortedEntries[index][0]);
    var currentDate = date.getDate();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();

    var year_month_key = currentYear + "-" + currentMonth;
    var element_to_be_deleted_index = dark_days_map[year_month_key].indexOf(currentDate);
    if (element_to_be_deleted_index > -1) {
      dark_days_map[year_month_key].splice(element_to_be_deleted_index, 1);
    }
  }

  console.log("##############final dark_days_map:\n" + JSON.stringify(dark_days_map));
  console.log("dark_days_map.keys", Object.keys(dark_days_map));
  for (var key in dark_days_map) {
    console.log("Key", key);
    dark_days_map[key] = dark_days_map[key].length;
    result.push([new Date(key + "-" + "15").getTime(), dark_days_map[key]]);
  }

  console.log("##############final dark days result array:\n" + JSON.stringify(result));

  return result;
}