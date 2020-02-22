function create_dark_days_map(start_date) {
    var dark_days = new Map();
    var today = new Date();
    var start_year = start_date.getFullYear();
    var start_month = start_date.getMonth();
    var start_day = start_date.getDate();
    var year_now = today.getFullYear();
    var month_now = today.getMonth(); 
    var day_now = today.getDate();

    for (var year_index = start_year; year_index <= year_now; year_index++ ) {
        for (var month_index = 1; month_index <= 12; month_index++) {
          if (year_index == start_year && month_index < start_month) {
            continue;
          }
    
          if (year_index == year_now && month_index > month_now) {
            continue;
          }
    
          var number_of_days_per_month = new Date(year_index, month_index, 0).getDate();
          var days_set = new Set();
          for (var day_index = 1; day_index <= number_of_days_per_month; day_index++) {
            if (year_index == start_year && month_index == start_month && day_index < start_day) {
              continue;
            }
    
            if (year_index == year_now && month_index == month_now && day_index > day_now) {
              continue;
            }
    
            days_set.add(day_index);
          }
          var light_days_key = year_index + "-" + month_index;
          dark_days.set(light_days_key, days_set);
    
          console.log("Full dark days map: " + dark_days);
        }
      }

      return dark_days;
}