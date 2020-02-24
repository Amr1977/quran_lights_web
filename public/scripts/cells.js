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
      element.style.border = "thick solid rgb(0,0,255)";
    }
    else if (daysElapsed >= 30 && timeStampsArray.length > 0) {
      element.style.border = "thick solid rgb(255,0,0)";
    }
    var suraName = element.index + " " + SuraNamesEn[suraIndex - 1];
    var daysElapsedText = daysElapsed == 0 || daysElapsed > 1000 ? "" : daysElapsed + " Days";
    if (timeDifferenceRatio >= 0.3) {
      element.style.color = "black";
    }
    else {
      element.style.color = "white";
    }
    var suraNameElement = document.createElement("p");
    var suraNameElementAr = document.createElement("span");
    suraNameElement.textContent = SuraNamesEn[suraIndex - 1];
    suraNameElement.className = "sura_name_label";
    suraNameElementAr.textContent = SuraNamesAr[suraIndex - 1];
    suraNameElementAr.className = "sura_name_label";
    switch (surasHistory[suraIndex].memorization) {
      case MEMORIZATION_STATE_MEMORIZED:
        if (daysElapsed >= 10) {
          suraNameElement.className = "old-memorized sura_name_label";
        }
        else {
          suraNameElement.className = "memorized sura_name_label";
        }
        break;
      default:
        suraNameElement.className = "not_memorized sura_name_label";
    }
    suraNameElement.textContent = suraName;
    element.appendChild(suraNameElementAr);
    element.appendChild(suraNameElement);
    var charCountText = readableFormat(suraCharCount[suraIndex - 1]);
    //Char count
    var charCountElement = document.createElement("span");
    charCountElement.id = "char-count";
    charCountElement.style.float = "left";
    charCountElement.style.fontSize = ".6vw";
    charCountElement.textContent = charCountText;
    element.appendChild(charCountElement);
    //Days elapsed
    if (daysElapsed != 0) {
      var daysElapsedElement = document.createElement("span"); //document.createTextNode(daysElapsedText);
      daysElapsedElement.style.float = "right";
      daysElapsedElement.style.fontSize = ".6vw";
      daysElapsedElement.textContent = daysElapsedText;
      daysElapsedElement.id = "days";
      element.appendChild(daysElapsedElement);
    }
    //element.appendChild(memoDiv);
    element.ondblclick = function () {
      var timeStamp = Math.floor(Date.now() / 1000);
      var index = this.index;
      $(".sura-" + index).addClass("animated bounceIn");
      refreshSura(index, timeStamp);
    };
    element.onclick = function () {
      var index = this.index;
      if (alt_pressed) {
        $(".sura-" + index).addClass("animated bounceIn");
        toggle_memorization(index);
      }
      else if (shift_pressed) {
        toggle_select(index);
      }
    };
    document.getElementById("reviews").appendChild(element);
  }
  buildingSurasFlag = false;
  $("#reviews").addClass("animated bounce");
  update_score();
  update_selection_score();
  update_charts();
  //periodically refresh
  if (periodicRefreshTimerRef != null) {
    clearInterval(periodicRefreshTimerRef);
  }
  periodicRefreshTimerRef = setInterval(addSuraCells, autoRefreshPeriod);
}