function get_reverse_sort_order() {
  var is_reverse_sort_order = get_initial_local_object("reverse_sort_order", false);;
  console.log("is_reverse_sort_order: ", is_reverse_sort_order);
  return is_reverse_sort_order;
};

function set_reverse_sort_order(value) {
  set_local_storage_object("reverse_sort_order", value);
  add_sura_cells();
}

function set_sort_order() {
  set_sort_order_with_value(document.getElementById("sort_order").value);
  add_sura_cells();
}

function  set_sort_order_with_value(value)  {
  if (!value) { 
    value = "normal";
  }

  sort_order = value;
  set_local_storage_object("sort_order", sort_order);
  document.getElementById("sort_order").value = value;
}

var revalationSortedSuraArray = [];

function createRevalationSuraOrderArray() {
  revalationSortedSuraArray = [];
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

  if (get_reverse_sort_order()) {
    revalationSortedSuraArray.reverse();
  }
}

var verseCountSortedSuraArray = [];

function createVerseCountSuraOrderArray() {
  verseCountSortedSuraArray = []
  for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
    var suraWithVerseCountRecord = {
      suraID: suraIndex,
      verseCount: suraVerseCount[suraIndex - 1]
    };
    verseCountSortedSuraArray.push(suraWithVerseCountRecord);
  }

  verseCountSortedSuraArray = sortByKey(
    verseCountSortedSuraArray,
    "verseCount"
  );

  if (get_reverse_sort_order()) {
    verseCountSortedSuraArray.reverse();
  }
}

var characterCountSortedSuraArray = [];

function createCharCountSuraOrderArray() {
  characterCountSortedSuraArray = [];
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

  if (get_reverse_sort_order()) {
    characterCountSortedSuraArray.reverse();
  }
}

var wordCountSortedSuraArray = [];

function createWordCountSuraOrderArray() {
  wordCountSortedSuraArray = [];
  for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
    var suraWithWordCountRecord = {
      suraID: suraIndex,
      wordCount: suraCharCount[suraIndex - 1]
    };
    wordCountSortedSuraArray.push(suraWithWordCountRecord);
  }

  wordCountSortedSuraArray = sortByKey(wordCountSortedSuraArray, "wordCount");

  if (get_reverse_sort_order()) {
    wordCountSortedSuraArray.reverse();
  }
}

function createSortedTimeStampSuraArray() {
  sortedTimestampSuraArray = [];

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

  if (get_reverse_sort_order()) {
    sortedTimestampSuraArray.reverse();
  }
}

var refreshCountSortedSuraArray = [];

function createSortedRefreshCountSuraArray() {
  refreshCountSortedSuraArray = [];
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

  if (get_reverse_sort_order()) {
    refreshCountSortedSuraArray.reverse();
  }
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

function apply_reverse_sort_order(){
  set_reverse_sort_order(!get_reverse_sort_order());
  add_sura_cells();
}
