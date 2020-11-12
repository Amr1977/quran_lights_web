var click_event_queue = [];
//TODO needs refactor!!!
async function add_sura_cells() {
  if (buildingSurasFlag) {
    return;
  }
  surasColorTable = [];
  buildingSurasFlag = true;
  clear_reviews();
  
  var currentTimeStamp = Math.floor(Date.now() / 1000);
  var refreshPeriod = get_refresh_period_days() * 24 * 60 * 60;
  lightRatio = 0;
  conquerRatio = 0;
  for (var cellIndex = 1; cellIndex <= 114; cellIndex++) {
    var suraIndex = sortedSuraIndexConverter(cellIndex);
    var element = document.createElement("button");
    element.index = suraIndex;
    element.className = "sura-cell" + " sura-" + suraIndex + " animated bounceIn";
    if (surasHistory[suraIndex] == null) {
      surasHistory[suraIndex] = {};
      surasHistory[suraIndex].history = [];
      surasHistory[suraIndex].suraIndex = suraIndex;
      surasHistory[suraIndex].memorization = MEMORIZATION_STATE_NOT_MEMORIZED;
    }
    var timeStampsArray = surasHistory[suraIndex].history;
    //TODO if not refreshed before make it zero instead of (currentTimeStamp - refreshPeriod) and condition timeDifferenceRatio value to be zero too
    //TODO use minimum timestamp in all suras otherwise save current time as that minimum for later calculations
    var previous_refresh_time_stamp = timeStampsArray.length > 0
      ? timeStampsArray[timeStampsArray.length - 1]
      : get_initial_local_object("min_timestamp", currentTimeStamp);
    var timeDifferenceRatio = 1 -
      ((currentTimeStamp -
        (previous_refresh_time_stamp == 0 ? currentTimeStamp - refreshPeriod : previous_refresh_time_stamp)) *
        1.0) /
      refreshPeriod;
    timeDifferenceRatio = timeDifferenceRatio < 0 ? 0 : timeDifferenceRatio;
    lightRatio +=
      ((timeDifferenceRatio * suraCharCount[suraIndex - 1]) /
      full_khatma_char_count) *
      100.0;
    conquerRatio +=
      currentTimeStamp - previous_refresh_time_stamp < refreshPeriod
        ? (suraCharCount[suraIndex - 1] / full_khatma_char_count) * 100.0
        : 0;
    var greenComponent = (255.0 * timeDifferenceRatio).toFixed(0);
    if (timeStampsArray.length > 0) {
      element.style.backgroundColor = "rgb(0," + greenComponent + ",0)";
      surasColorTable[suraIndex - 1] = (greenComponent / 255) * 114;
    }
    else {
      element.style.backgroundImage = "url('images/desert.jpg')";
      surasColorTable[suraIndex - 1] = 0;
    }
    colorHash[cellIndex] = rgbToHex(0, greenComponent, 0);
    var daysElapsed = ((currentTimeStamp - previous_refresh_time_stamp) /
      (60 * 60 * 24.0));
      elapsed_days[suraIndex - 1] = Number(daysElapsed);
    if (selected_suras.indexOf(suraIndex) !== -1) {
      element.classList.add("selected");
    }
    else if (daysElapsed >= get_refresh_period_days()) {
      element.classList.add("old-refresh");
    }

    var header = document.createElement("div");
    header.className = "cell_header";

    var verseCount = suraVerseCount[suraIndex - 1];
    var sura_verse_count_element = document.createElement("div");
    sura_verse_count_element.className = "sura_verse_count";
    sura_verse_count_element.textContent = verseCount + "V";
    header.appendChild(sura_verse_count_element);

    var sura_index_element = document.createElement("div");
    sura_index_element.className = "sura_index";
    sura_index_element.textContent = "#" + suraIndex;
    header.appendChild(sura_index_element);

    element.appendChild(header);

    var suraName = SuraNamesEn[suraIndex - 1];
    var daysElapsedText = get_humanized_period(daysElapsed);

    var suraNameElement = document.createElement("div");
    var suraNameElementAr = document.createElement("div");
    suraNameElement.className = "sura_name_label";
    suraNameElementAr.textContent = SuraNamesAr[suraIndex - 1];
    suraNameElementAr.className = "sura_name_label";
    switch (surasHistory[suraIndex].memorization) {
      case MEMORIZATION_STATE_MEMORIZED:
        if (daysElapsed >= get_memorized_refresh_period_days() || daysElapsed >= get_refresh_period_days()) {
          suraNameElement.className = "old-memorized sura_name_label";
        }
        else {
          suraNameElement.className = "memorized sura_name_label";
        }
        break;
      default:
        suraNameElement.className = "not_memorized sura_name_label";
    }
    if (timeDifferenceRatio >= 0.5) {
      element.style.color = "black";
    }
    else {
      element.style.color = "white";
    }
    suraNameElement.textContent = suraName;
    element.appendChild(suraNameElementAr);
    element.appendChild(suraNameElement);

    var charCountText = readableFormat(suraCharCount[suraIndex - 1]);
    //Char count
    var charCountElement = document.createElement("span");
    charCountElement.className = "char-count";
    charCountElement.textContent = charCountText;
    element.appendChild(charCountElement);
    //Days elapsed
    if (daysElapsed != 0) {
      var daysElapsedElement = document.createElement("span"); //document.createTextNode(daysElapsedText);
      daysElapsedElement.className = "elapsed_days";
      daysElapsedElement.textContent = daysElapsedText;
      // daysElapsedElement.id = "days";
      element.appendChild(daysElapsedElement);
    }

    Array.from(element.children).forEach((child)=> {
      $(child).addClass("noselect");
    })
  
    element.onclick = function() {
      play_mouse_enter_sound();
      click_handler(this.index);
    };

    element.onmouseenter = function(event) {
      play_mouse_enter_sound();
      if(event.buttons) {
        toggle_select(this.index);
      }
    }

    document.getElementById("reviews").appendChild(element);
  }
  buildingSurasFlag = false;
  $("#reviews").addClass("animated bounce");
  setup_light_days_options();
  setup_memorized_light_days_options();
  updateDeselectButton();
  update_selection_score();
  update_score();
  //periodically refresh
  if (periodicRefreshTimerRef != null) {
    clearInterval(periodicRefreshTimerRef);
  }
  periodicRefreshTimerRef = setInterval(add_sura_cells, AUTO_REFRESH_PERIOD);
}

function do_double_click(index){
  while(click_event_queue.length > 0 && click_event_queue[0].index == index) {
    console.log("dropped click entry for ", index);
    click_event_queue.shift()
  }
  
  var timeStamp = Math.floor(Date.now() / 1000);
  $(".sura-" + index).addClass("animated bounceIn");
  refreshSura(index, timeStamp);
}

function do_click() {
  if (click_event_queue.length == 0) return;

  var event = click_event_queue.pop();
  if (!event) {
    console.log("Empty click event queue.");
    return;
  }

  if (event.alt_pressed) {
    $(".sura-" + event.index).addClass("animated bounceIn");
    toggle_memorization(event.index);
  } else if(event.shift_pressed) {
    open_ayat_for_sura(event.index);
  } else {
    toggle_select(event.index);
  }
}

function open_ayat_for_sura(sura_index) {
  window.open( 
    "http://quran.ksu.edu.sa/index.php?l=en#aya=" + sura_index + "_1&m=hafs&qaree=absulbasit.m&trans=en_sh", "_blank"); 
}

//TODO fix this: this.index how to pass parameter
var click_handler = function (index) {
  if (is_mobile || click_event_queue.length > 0 && click_event_queue[0].index == index) {
    do_double_click(index);
  } else {
    var click_event = {};
    click_event.index = index;
    click_event.alt_pressed = alt_pressed;
    click_event.shift_pressed = shift_pressed;
    click_event.ctrl_pressed = ctrl_pressed;
    click_event.cmd_pressed = cmd_pressed;

    click_event_queue.unshift(click_event);
    setTimeout(do_click, SINGLE_CLICK_EVENT_DAMPING_DELAY);
  }
};