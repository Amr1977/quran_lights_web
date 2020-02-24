function set_sort_order() {
  set_sort_order_with_value(document.getElementById("sort_order").value);
}

function  set_sort_order_with_value(value)  {
  if (!value) { 
    value = "normal";
  }

  sort_order = value;
  setLocalStorageObject("sort_order", sort_order);
  document.getElementById("sort_order").value = value;

  addSuraCells();
}

var revalationSortedSuraArray = [];

function createRevalationSuraOrderArray() {
  if (revalationSortedSuraArray.length != 0) {
    return;
  }
  for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
    var suraWithCharCountRecord = {
      suraID: suraIndex,
      revalOrder: suraRevalationOrder[suraIndex - 1]
    };
    revalationSortedSuraArray.push(suraWithCharCountRecord);
  }

  revalationSortedSuraArray = sortByKey(
    revalationSortedSuraArray,
    "revalOrder"
  );
}

var verseCountSortedSuraArray = [];

function createVerseCountSuraOrderArray() {
  if (verseCountSortedSuraArray.length != 0) {
    return;
  }
  for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
    var suraWithCharCountRecord = {
      suraID: suraIndex,
      verseCount: suraCharCount[suraIndex - 1]
    };
    verseCountSortedSuraArray.push(suraWithCharCountRecord);
  }

  verseCountSortedSuraArray = sortByKey(
    verseCountSortedSuraArray,
    "verseCount"
  );
}

var characterCountSortedSuraArray = [];

function createCharCountSuraOrderArray() {
  if (characterCountSortedSuraArray.length != 0) {
    return;
  }
  for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
    var suraWithCharCountRecord = {
      suraID: suraIndex,
      charCount: suraCharCount[suraIndex - 1]
    };
    characterCountSortedSuraArray.push(suraWithCharCountRecord);
  }

  characterCountSortedSuraArray = sortByKey(
    characterCountSortedSuraArray,
    "charCount"
  );
}

var wordCountSortedSuraArray = [];

function createWordCountSuraOrderArray() {
  if (wordCountSortedSuraArray.length != 0) {
    return;
  }
  for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
    var suraWithWordCountRecord = {
      suraID: suraIndex,
      wordCount: suraCharCount[suraIndex - 1]
    };
    wordCountSortedSuraArray.push(suraWithWordCountRecord);
  }

  wordCountSortedSuraArray = sortByKey(wordCountSortedSuraArray, "wordCount");
}

function createSortedTimeStampSuraArray() {
  if (sortedTimestampSuraArray.length != 0) {
    return;
  }

  for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
    var timeStampsArray =
      surasHistory[suraIndex].history != null
        ? surasHistory[suraIndex].history
        : [];
    var mostRecentTimestamp =
      timeStampsArray.length > 0
        ? timeStampsArray[timeStampsArray.length - 1]
        : 0;
    var suraWithLastTimeStampRecord = {
      suraID: suraIndex,
      timeStamp: mostRecentTimestamp
    };
    sortedTimestampSuraArray.push(suraWithLastTimeStampRecord);
  }

  sortedTimestampSuraArray = sortByKey(sortedTimestampSuraArray, "timeStamp");
}

var refreshCountSortedSuraArray = [];

function createSortedRefreshCountSuraArray() {
  if (refreshCountSortedSuraArray.length != 0) {
    return;
  }
  for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
    var timeStampsArray =
      surasHistory[suraIndex] != null && surasHistory[suraIndex].history != null
        ? surasHistory[suraIndex].history
        : [];
    var mostRecentTimestamp = timeStampsArray.length;
    var suraWithRefreshCountRecord = {
      suraID: suraIndex,
      refreshCount: mostRecentTimestamp
    };
    refreshCountSortedSuraArray.push(suraWithRefreshCountRecord);
  }

  refreshCountSortedSuraArray = sortByKey(
    refreshCountSortedSuraArray,
    "refreshCount"
  );
}

function sortedSuraIndexConverter(index) {
  switch (sort_order) {
    //Normal sura order
    case SORT_ORDER_NORMAL:
      return index;

    //light order
    case SORT_ORDER_LIGHT:
      createSortedTimeStampSuraArray();
      return sortedTimestampSuraArray[index - 1].suraID;

    //character count order
    case SORT_ORDER_CHAR_COUNT:
      createCharCountSuraOrderArray();
      return characterCountSortedSuraArray[index - 1].suraID;

    //verse count order
    case SORT_ORDER_VERSE_COUNT:
      createVerseCountSuraOrderArray();
      return verseCountSortedSuraArray[index - 1].suraID;

    //word count sort
    case SORT_ORDER_WORD_COUNT:
      createWordCountSuraOrderArray();
      return wordCountSortedSuraArray[index - 1].suraID;

    //revalation order
    case SORT_ORDER_REVELATION:
      createRevalationSuraOrderArray();
      return revalationSortedSuraArray[index - 1].suraID;

    //refresh count
    case SORT_ORDER_REFRESH_COUNT:
      createSortedRefreshCountSuraArray();
      return refreshCountSortedSuraArray[index - 1].suraID;

    default:
      return index;
  }
}
