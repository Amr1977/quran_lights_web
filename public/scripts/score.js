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
            reviewed_today.add(i);
            review_score += suraScore;
          }
        }
        else {
          if (!read_today.has(i)) {
            read_today.add(i);
            read_score += suraScore;
          }
        }
        today += suraScore;
        lastEntryIndex--;
      }
    }

    scores = {"total": total, "today_total": today, "today_review": review_score, "today_read": read_score};

    return [total, today, review_score, read_score];
  }

  function update_score () {
    var score_array = getScore();
    review_today = score_array[2];
    console.log(score_array);
    document.getElementById("score").textContent = "Total Balance: " + readableFormat(score_array[0]);
    document.getElementById("today_score").textContent = "Today Revenue: " + readableFormat(score_array[1]);
    document.getElementById("today_review_score").textContent = "* Review Revenue: " + readableFormat(review_today) + " of [" + readableFormat(memorization_state["memorized"] / get_refresh_period_days()) +"]";
    document.getElementById("today_read_score").textContent = "* Read Revenue: " + readableFormat(score_array[3]) + " of [" + readableFormat(memorization_state["not_memorized"] / get_refresh_period_days()) +"]";;
    animate_score();
  }

  async function animate_score() {
    document.getElementById("today_score").className = "score";
    //TODO test it!
    //document.getElementById("today_score").className = "score animated bounceIn";
    $("#today_score").addClass("animated bounceIn");
  }