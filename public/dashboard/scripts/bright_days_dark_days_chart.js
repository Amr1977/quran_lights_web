function create_dark_days_map(start_date) {
  let dark_days = {};
  let today = new Date();
  let start_year = start_date.getFullYear();
  let start_month = start_date.getMonth() + 1;
  let start_day = start_date.getDate();
  let year_now = today.getFullYear();
  let month_now = today.getMonth() + 1;
  let day_now = today.getDate();

  for (let year_index = start_year; year_index <= year_now; year_index++) {
    for (let month_index = 1; month_index <= 12; month_index++) {
      if (year_index == start_year && month_index < start_month) {
        continue;
      }

      if (year_index == year_now && month_index > month_now) {
        continue;
      }

      let number_of_days_per_month = new Date(year_index, month_index, 0).getDate();
      let days_array = [];
      for (let day_index = 1; day_index <= number_of_days_per_month; day_index++) {
        if (year_index == start_year && month_index == start_month && day_index < start_day) {
          continue;
        }

        if (year_index == year_now && month_index == month_now && day_index > day_now) {
          continue;
        }

        days_array.push(day_index);

      }

      let light_days_key = year_index + "-" + month_index;
      
      dark_days[light_days_key] = days_array;
      ;
    }
  }

  return dark_days;
}

function dark_days_data() {

  let result = [];

  let sortedEntries = get_flat_timestamp_score_array();
  if (!sortedEntries || sortedEntries.length == 0) {
    return [];
  }
  let dark_days_map = create_dark_days_map(new Date(sortedEntries[0][0]));

  let prevMonth = new Date(sortedEntries[0][0]).getMonth() + 1;
  let prevYear = new Date(sortedEntries[0][0]).getFullYear();
  let year_month_key = prevYear + "-" + prevMonth;


  for (let index = 0; index < sortedEntries.length; index++) {
    let date = new Date(sortedEntries[index][0]);
    let currentDate = date.getDate();
    let currentMonth = date.getMonth() + 1;
    let currentYear = date.getFullYear();

    let year_month_key = currentYear + "-" + currentMonth;
    let element_to_be_deleted_index = dark_days_map[year_month_key].indexOf(currentDate);
    if (element_to_be_deleted_index > -1) {
      dark_days_map[year_month_key].splice(element_to_be_deleted_index, 1);
    }
  }

  for (let key in dark_days_map) {
    dark_days_map[key] = dark_days_map[key].length;
    result.push([new Date(key + "-" + "15").getTime(), dark_days_map[key]]);
  }

  return result;
}

function light_days_data() {

  let result = [];

  let sortedEntries = get_flat_timestamp_score_array();
  if (!sortedEntries || sortedEntries.length == 0) {
    return [];
  }
  let light_days_map = {};

  let prevMonth = new Date(sortedEntries[0][0]).getMonth() + 1;
  let prevYear = new Date(sortedEntries[0][0]).getFullYear();
  let year_month_key = prevYear + "-" + prevMonth;


  for (let index = 0; index < sortedEntries.length; index++) {
    let date = new Date(sortedEntries[index][0]);
    let currentDate = date.getDate();
    let currentMonth = date.getMonth() + 1;
    let currentYear = date.getFullYear();

    let year_month_key = currentYear + "-" + currentMonth;
    if (!light_days_map[year_month_key]) {
      light_days_map[year_month_key] = [];
    }
    let element_to_be_deleted_index = light_days_map[year_month_key].indexOf(currentDate);
    if (element_to_be_deleted_index == -1) {
      light_days_map[year_month_key].push(currentDate);
    }
  }

  for (let key in light_days_map) {
    light_days_map[key] = light_days_map[key].length;
    result.push([new Date(key + "-" + "15").getTime(), light_days_map[key]]);
  }

  return result;
}