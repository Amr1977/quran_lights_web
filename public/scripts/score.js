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

    return [total, today, review_score, read_score];
  }

  function update_score () {
    var score_array = getScore();
    review_today = score_array[2];
    console.log(score_array);
    document.getElementById("display_name").textContent = firebase.auth().currentUser.email.toUpperCase();
    document.getElementById("score").textContent = "Total Balance: " + formatter.format(score_array[0]);
    document.getElementById("today_score").textContent = "Today Amount: " + formatter.format(score_array[1]);
    document.getElementById("today_review_score").textContent = "Today Review Amount: " + formatter.format(review_today);
    document.getElementById("today_read_score").textContent = "Today Read Amount: " +formatter.format(score_array[3]);
    animate_score();
  }

  function animate_score() {
    document.getElementById("today_score").className = "score";
    document.getElementById("today_score").className = "score animated bounce";
  }