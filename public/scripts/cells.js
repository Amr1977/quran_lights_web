var click_event_queue = [];
function addSuraCells() {
  console.log("addSuraCells invoked.");
  //TODO reuse cells
  if (buildingSurasFlag) {
    return;
  }
  surasColorTable = [];
  buildingSurasFlag = true;
  var reviewsNode = document.getElementById("reviews");
  while (reviewsNode.firstChild) {
    reviewsNode.removeChild(reviewsNode.firstChild);
  }
  var currentTimeStamp = Math.floor(Date.now() / 1000);
  var refreshPeriod = refreshPeriodDays * 24 * 60 * 60;
  lightRatio = 0;
  conquerRatio = 0;
  for (var cellIndex = 1; cellIndex <= 114; cellIndex++) {
    var suraIndex = sortedSuraIndexConverter(cellIndex);
    var element = document.createElement("button");
    element.index = suraIndex;
    element.className = "sura-cell" + " sura-" + suraIndex;
    if (surasHistory[suraIndex] == null) {
      surasHistory[suraIndex] = {};
      surasHistory[suraIndex].history = [];
      surasHistory[suraIndex].suraIndex = suraIndex;
      surasHistory[suraIndex].memorization = MEMORIZATION_STATE_NOT_MEMORIZED;
    }
    var timeStampsArray = surasHistory[suraIndex].history;
    //TODO if not refreshed before make it zero instead of (currentTimeStamp - refreshPeriod) and condition timeDifferenceRatio value to be zero too
    var maxStamp = timeStampsArray.length > 0
      ? timeStampsArray[timeStampsArray.length - 1]
      : 0;
    var timeDifferenceRatio = 1 -
      ((currentTimeStamp -
        (maxStamp == 0 ? currentTimeStamp - refreshPeriod : maxStamp)) *
        1.0) /
      refreshPeriod;
    timeDifferenceRatio = timeDifferenceRatio < 0 ? 0 : timeDifferenceRatio;
    lightRatio +=
      ((timeDifferenceRatio * suraCharCount[suraIndex - 1]) /
        fullKhatmaCharCount) *
      100.0;
    conquerRatio +=
      currentTimeStamp - maxStamp < refreshPeriod
        ? (suraCharCount[suraIndex - 1] / fullKhatmaCharCount) * 100.0
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
    var daysElapsed = ((currentTimeStamp - maxStamp) /
      (60 * 60 * 24.0)).toFixed(0);
      elapsed_days[suraIndex - 1] = Number(daysElapsed);
    if (selected_suras.indexOf(suraIndex) !== -1) {
      element.classList.add("selected");
    }
    else if (daysElapsed >= 30 && timeStampsArray.length > 0) {
      element.style.border = "thick solid rgb(255,0,0)";
    }

    var suraName = element.index + " " + SuraNamesEn[suraIndex - 1];
    var daysElapsedText = daysElapsed == 0 || daysElapsed > 1000 ? "" : daysElapsed + " Days";

    var suraNameElement = document.createElement("p");
    var suraNameElementAr = document.createElement("div");
    suraNameElement.textContent = SuraNamesEn[suraIndex - 1];
    suraNameElement.className = "sura_name_label";
    suraNameElementAr.textContent = SuraNamesAr[suraIndex - 1];
    suraNameElementAr.className = "sura_name_label";
    switch (surasHistory[suraIndex].memorization) {
      case MEMORIZATION_STATE_MEMORIZED:
        if (daysElapsed >= MAX_ELAPSED_DAYS_FOR_MEMORIZED_SURAS) {
          suraNameElement.className = "old-memorized sura_name_label";
        }
        else {
          suraNameElement.className = "memorized sura_name_label";
          suraNameElement.style.backgroundColor = "rgba(255, 255, 0," + (MAX_ELAPSED_DAYS_FOR_MEMORIZED_SURAS - daysElapsed) / MAX_ELAPSED_DAYS_FOR_MEMORIZED_SURAS + ")";
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
    
    var verseCount = suraVerseCount[suraIndex - 1];
    var suraVerseCountElement = document.createElement("div");
    suraVerseCountElement.textContent = verseCount + " Verses";
    
    element.appendChild(suraVerseCountElement);
    suraVerseCountElement.className = "sura_verse_count";

    var charCountText = readableFormat(suraCharCount[suraIndex - 1]);
    //Char count
    var charCountElement = document.createElement("span");
    charCountElement.className = "char-count";
    charCountElement.textContent = charCountText;
    element.appendChild(charCountElement);
    //Days elapsed
    if (daysElapsed != 0) {
      var daysElapsedElement = document.createElement("span"); //document.createTextNode(daysElapsedText);
      daysElapsedElement.style.float = "right";
      daysElapsedElement.style.fontSize = "12px";
      daysElapsedElement.textContent = daysElapsedText;
      daysElapsedElement.id = "days";
      element.appendChild(daysElapsedElement);
    }
    //element.appendChild(memoDiv);
    element.onclick = function () {
      if (click_event_queue.length > 0 && click_event_queue[0].index == this.index) {
        console.log("double click detected.");
        do_double_click(this.index);
      } else {
        var click_event = {};
        click_event.index = this.index;
        click_event.alt_pressed = alt_pressed;
        click_event.shift_pressed = shift_pressed;
        click_event.ctrl_pressed = ctrl_pressed;
        click_event.cmd_pressed = cmd_pressed;
  
        click_event_queue.unshift(click_event);
        setTimeout(do_click, SINGLE_CLICK_EVENT_DAMPING_DELAY);
      }
    };

    document.getElementById("reviews").appendChild(element);
  }
  buildingSurasFlag = false;
  $("#reviews").addClass("animated bounce");
  setup_light_days_options();
  updateDeselectButton();
  update_score();
  update_selection_score();
  update_charts();
  //periodically refresh
  if (periodicRefreshTimerRef != null) {
    clearInterval(periodicRefreshTimerRef);
  }
  periodicRefreshTimerRef = setInterval(addSuraCells, autoRefreshPeriod);
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

  console.log("Delayed click event on cell: ", event.index);
  if (event.alt_pressed) {
    $(".sura-" + event.index).addClass("animated bounceIn");
    toggle_memorization(event.index);
  } else if(event.shift_pressed) {
    window.open("http://quran.ksu.edu.sa/index.php?l=en#aya=" + event.index + "_1&m=hafs&qaree=tunaiji&trans=en_sh");
  } else {
    toggle_select(event.index);
  }
}