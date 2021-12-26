var menu;

var click_event_queue = [];
var debts = {"reading_debt": 0, "review_debt": 0};
//TODO needs refactor!!!
async function add_sura_cells() {
  if (buildingSurasFlag) {
    return;
  }
  surasColorTable = [];
  buildingSurasFlag = true;
  clear_reviews();
  debts = {"read": 0, "review": 0};

  let currentTimeStamp = Math.floor(Date.now() / 1000);
  let refreshPeriod = get_refresh_period_days() * 24 * 60 * 60;
  lightRatio = 0;
  conquerRatio = 0;
  for (let cellIndex = 1; cellIndex <= 114; cellIndex++) {
    let suraIndex = sortedSuraIndexConverter(cellIndex);
    let element = document.createElement("button");
    element.index = suraIndex;
    element.className = "sura-cell" + " sura-" + suraIndex + " animated bounceIn";
    element.id = "sura-" + suraIndex;
    if (surasHistory[suraIndex] == null) {
      surasHistory[suraIndex] = {};
      surasHistory[suraIndex].history = [];
      surasHistory[suraIndex].suraIndex = suraIndex;
      surasHistory[suraIndex].memorization = MEMORIZATION_STATE_NOT_MEMORIZED;
    }
    let timeStampsArray = surasHistory[suraIndex].history;
    let tooltip_text = "Surah index: " +  suraIndex;
    //TODO if not refreshed before make it zero instead of (currentTimeStamp - refreshPeriod) and condition timeDifferenceRatio value to be zero too
    //TODO use minimum timestamp in all suras otherwise save current time as that minimum for later calculations
    let previous_refresh_time_stamp = timeStampsArray.length > 0
      ? timeStampsArray[timeStampsArray.length - 1]
      : get_initial_local_object("min_timestamp", currentTimeStamp);
      let timeDifferenceRatio = 1 -
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
        let greenComponent = (255.0 * timeDifferenceRatio).toFixed(0);
    if (timeStampsArray.length > 0) {
      element.style.backgroundColor = "rgb(0," + greenComponent + ",0)";
      surasColorTable[suraIndex - 1] = (greenComponent / 255) * 114;
    }
    else {
      element.style.backgroundImage = "url('dashboard/images/desert.jpg')";
      surasColorTable[suraIndex - 1] = 0;
    }
    colorHash[cellIndex] = rgbToHex(0, greenComponent, 0);
    let daysElapsed = ((currentTimeStamp - previous_refresh_time_stamp) /
      (60 * 60 * 24.0));
      elapsed_days[suraIndex - 1] = Number(daysElapsed);
    if (selected_suras.indexOf(suraIndex) !== -1) {
      element.classList.add("selected");
    }
    else if (daysElapsed >= get_refresh_period_days()) {
      element.classList.add("old-refresh");
    }

    let header = document.createElement("div");
    header.className = "cell_header";

    let verseCount = suraVerseCount[suraIndex - 1];
    let sura_verse_count_element = document.createElement("div");
    sura_verse_count_element.className = "sura_verse_count";
    sura_verse_count_element.textContent = verseCount + "V";
    add_tooltip(sura_verse_count_element, "Verses count");
    tooltip_text = tooltip_text.concat("\nVerses count: " +  verseCount);
    header.appendChild(sura_verse_count_element);

    let sura_index_element = document.createElement("div");
    sura_index_element.className = "sura_index";
    sura_index_element.textContent = "#" + suraIndex;
    add_tooltip(sura_index_element, "Surah Index");
    
    header.appendChild(sura_index_element);

    element.appendChild(header);

    let suraName = SuraNamesEn[suraIndex - 1];
    let daysElapsedText = get_humanized_period(daysElapsed);

    let suraNameElement = document.createElement("div");
    let suraNameElementAr = document.createElement("div");
    suraNameElement.className = "sura_name_label";
    suraNameElementAr.textContent = SuraNamesAr[suraIndex - 1];
    suraNameElementAr.className = "sura_name_label";
    switch (surasHistory[suraIndex].memorization) {
      case MEMORIZATION_STATE_MEMORIZED:
        if (daysElapsed >= get_memorized_refresh_period_days() || daysElapsed >= get_refresh_period_days()) {
          suraNameElement.className = "old-memorized sura_name_label";
          add_tooltip(suraNameElement, "Memorized but passed light days");
          tooltip_text = tooltip_text.concat("\nMemorization: Memorized");
          debts["review"] += suraCharCount[suraIndex - 1];
        }
        else {
          suraNameElement.className = "memorized sura_name_label";
          add_tooltip(suraNameElement, "This Surah Memorized");
          tooltip_text = tooltip_text.concat("\nMemorization: Memorized");
        }
        break;

        case MEMORIZATION_STATE_WAS_MEMORIZED:
          suraNameElement.className = "was_memorized sura_name_label";
          add_tooltip(suraNameElement, "Surah was Memorized");
          tooltip_text = tooltip_text.concat("\nMemorization: Was Memorized");
          if (daysElapsed >= get_refresh_period_days()) {
            debts["read"] += suraCharCount[suraIndex - 1];
          }
          break;

          case MEMORIZATION_STATE_BEING_MEMORIZED:
          suraNameElement.className = "being_memorized sura_name_label";
          add_tooltip(suraNameElement, "Being Memorized");
          tooltip_text = tooltip_text.concat("\nMemorization: Being Memorized");
          if (daysElapsed >= get_refresh_period_days()) {
            debts["read"] += suraCharCount[suraIndex - 1];
          }
          break;


      default:
        suraNameElement.className = "not_memorized sura_name_label";
        add_tooltip(suraNameElement, "Not Memorized");
        tooltip_text = tooltip_text.concat("\nMemorization: Not Memorized");
        if (daysElapsed >= get_refresh_period_days()) {
          debts["read"] += suraCharCount[suraIndex - 1];
        }
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

    let charCountText = readableFormat(suraCharCount[suraIndex - 1]);
    //Char count
    let charCountElement = document.createElement("span");
    charCountElement.className = "char-count";
    charCountElement.textContent = charCountText;
    add_tooltip(charCountElement, "Character count");
    tooltip_text = tooltip_text.concat("\nCharacter count:" + suraCharCount[suraIndex - 1]);
    element.appendChild(charCountElement);
    //Days elapsed
    if (daysElapsed != 0) {
      let daysElapsedElement = document.createElement("span");
      daysElapsedElement.className = "elapsed_days";
      daysElapsedElement.textContent = daysElapsedText;
      add_tooltip(daysElapsedElement, "Elapsed period since last refresh");
      tooltip_text = tooltip_text.concat("\nElapsed period since last refresh: " + daysElapsedText);
      // daysElapsedElement.id = "days";
      element.appendChild(daysElapsedElement);
    }

    Array.from(element.children).forEach((child)=> {
      $(child).addClass("noselect");
    })
  
    element.onclick = function(event) {
      console.log(event);
      play_mouse_enter_sound();
      click_handler(this.index, event);
    };

    element.onauxclick = function (event) {
      if (event.button === 2) {
        return;
      }
      console.log("Mouse Button clicked: " + event.button);
      open_ayat_for_sura(this.index);
    }

    // var open_context_menu = 

    element.oncontextmenu = function (event) {
      console.log("context on ", this.index);
      event.index = this.index;
      if (menu) {
        menu.hide();
      }
      menu = new ContextMenu({
        'theme': 'default', // or 'blue'
        'items': [
          {
            'name': 'إضاءة', action: function () {
              console.log("Refresh command fired ", event.index );
              do_double_click(event.index);
            }
          },
          {
            'name': 'تم الحفظ', action: function () {
              console.log("Memeorize command fired ", event.index);
              set_memorization(event.index, MEMORIZATION_STATE_MEMORIZED);
            }
          },
          {
            'name': 'لم تحفظ بعد', action: function () {
              console.log("Memeorize command fired ", event.index);
              set_memorization(event.index, MEMORIZATION_STATE_NOT_MEMORIZED);
            }
          },
          {
            'name': 'جاري الحفظ', action: function () {
              console.log("Memeorize command fired ", event.index);
              set_memorization(event.index, MEMORIZATION_STATE_BEING_MEMORIZED);
            }
          },
          {
            'name': 'أنسيتها !', action: function () {
              console.log("Memeorize command fired ", event.index);
              set_memorization(event.index, MEMORIZATION_STATE_WAS_MEMORIZED);
            }
          },
          {
            'name': 'القراءة من موقع آيات', action: function () {
              console.log("Open for read command fired ", event.index);
              open_ayat_for_sura(event.index);
            }
          }
        ]
      });

      // prevent default event
      event.preventDefault();
    
      // open the menu with a delay
      const time = menu.isOpen() ? 100 : 0;
    
      // hide the current menu (if any)
      menu.hide();
    
      // display menu at mouse click position
      setTimeout(() => { menu.show(event.pageX, event.pageY) }, time);

      // close the menu if the user clicks anywhere on the screen
      document.addEventListener('click', hideContextMenu, false);
    }

    element.onmouseenter = function(event) {
      play_mouse_enter_sound();
      if(event.buttons) {
        toggle_select(this.index);
      }
    }

    tooltip_text = tooltip_text.concat("\nRefresh Count: " + timeStampsArray.length);
    add_tooltip(element, tooltip_text);
    document.getElementById("reviews").appendChild(element);
  }
  buildingSurasFlag = false;
  $("#reviews").addClass("animated bounce");
  setup_reverse_sort_order_checkbox();
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

var hideContextMenu = function (event) {
  // hide the menu
  menu.hide();

  // remove the listener from the document
  document.removeEventListener('click', hideContextMenu);
}


function do_double_click(index){
  while(click_event_queue.length > 0 && click_event_queue[0].index == index) {
    console.log("dropped click entry for ", index);
    click_event_queue.shift()
  }
  
  let timeStamp = Math.floor(Date.now() / 1000);
  $(".sura-" + index).addClass("animated bounceIn");
  refresh_surah(index, timeStamp);
}

function do_click() {
  if (click_event_queue.length == 0) return;

  let event = click_event_queue.pop();
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
var click_handler = function (index, e) {
  if (click_event_queue.length > 0 && click_event_queue[0].index == index) {
    do_double_click(index);
  } else {
    let click_event = {};
    click_event.index = index;
    alt_pressed = e.altKey;
    shift_pressed = e.shiftKey;
    ctrl_pressed = e.ctrlKey;
    cmd_pressed = e.metaKey;

    click_event.alt_pressed = alt_pressed;
    click_event.shift_pressed = shift_pressed;
    click_event.ctrl_pressed = ctrl_pressed;
    click_event.cmd_pressed = cmd_pressed;
    click_event.event = e;

    click_event_queue.unshift(click_event);
    setTimeout(do_click, SINGLE_CLICK_EVENT_DAMPING_DELAY);
  }
};