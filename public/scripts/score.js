function getScore() {
    var total = 0;
    var today = 0;
    var read_today = new Set();
    var read_score = 0;
    var review_score = 0;
    var reviewed_today = new Set();
    var todayStart = todayStartTimeStamp();
    for (i = 1; i <= 114; i++) {
      var suraScore = suraCharCount[i - 1];
      var history = surasHistory[i].history;
      if (history == null) {
        history = [];
      }
      total = total + Number(history.length) * Number(suraScore);
      var lastEntryIndex = history.length - 1;
      //timestamps are sorted so we will start from their top going backward until we exceed today's start
      //TODO add a today-refreshed sura index to read_today if not memorized, add it to reviewd if memorized
      while (lastEntryIndex >= 0 && history[lastEntryIndex] >= todayStart) {
        if (surasHistory[i].memorization == MEMORIZATION_STATE_MEMORIZED) {
          if (!reviewed_today.has(i)) {
            console.log("Reviewed Sura: ", SuraNamesEn[i - 1]);
            reviewed_today.add(i);
            review_score += suraScore;
          }
        }
        else {
          if (!read_today.has(i)) {
            console.log("Read Sura: ", SuraNamesEn[i - 1]);
            read_today.add(i);
            read_score += suraScore;
          }
        }
        today += suraScore;
        console.log("Today added sura: ", SuraNamesEn[i - 1], history[lastEntryIndex]);
        lastEntryIndex--;
      }
    }
    return (readableFormat(total) +
      (today > 0 ? "(+" + readableFormat(today) + " today, (Review: " + readableFormat(review_score) + ", Read: " + readableFormat(read_score) + "))" : ""));
  }

  function update_score () {
    document.getElementById("score").textContent =
    getScore();
  }