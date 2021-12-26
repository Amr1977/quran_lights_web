function getScore() {
    var total = 0;
    var total_verses = 0;

    var today = 0;
    var today_verses = 0;

    var read_today = new Set();
    var read_score = 0;
    var review_score = 0;
    var reviewed_today = new Set();
    var todayStart = todayStartTimeStamp();
    for (i = 1; i <= 114; i++) {
      var suraScore = suraCharCount[i - 1];
      var sura_verse_count = suraVerseCount[i - 1];
      var history = surasHistory[i].history;
      if (history == null) {
        history = [];
      }
      total = total + Number(history.length) * Number(suraScore);
      total_verses = total_verses + Number(history.length) * Number(sura_verse_count);

      var lastEntryIndex = history.length - 1;
      //timestamps are sorted so we will start from their top going backward until we exceed today's start
      //TODO add a today-refreshed sura index to read_today if not memorized, add it to reviewd if memorized
      while (lastEntryIndex >= 0 && history[lastEntryIndex] >= todayStart) {
        if (surasHistory[i].memorization == MEMORIZATION_STATE_MEMORIZED) {
          if (!reviewed_today.has(i)) {
            reviewed_today.add(i);
            console.log("reviewed_today: " + i);
            review_score += suraScore;
          }
        }
        else {
          if (!read_today.has(i)) {
            read_today.add(i);
            console.log("read_today: " + i);
            read_score += suraScore;
          }
        }
        today += suraScore;
        today_verses += sura_verse_count
        lastEntryIndex--;
      }
    }

    //TODO handle verse_range score calculation
    for (let verse_range_fragment_index = 0; verse_range_fragment_index < verse_range_history.length; verse_range_fragment_index++) {
      let verse_range_transaction = verse_range_history[verse_range_fragment_index];
      let transaction_score = verse_range_score(verse_range_transaction["start_sura"], verse_range_transaction["start_verse"], verse_range_transaction["end_sura"], verse_range_transaction["end_verse"]);
      total += Number(transaction_score["char_count"]) * Number(verse_range_transaction["count"]);
      total_verse += Number(transaction_score["verse_count"]) * Number(verse_range_transaction["count"]);

      if (Number(verse_range_transaction["time"]) >= todayStartTimeStamp()) {
        today += Number(transaction_score["char_count"]) * Number(verse_range_transaction["count"]);
        today_verses += Number(transaction_score["verse_count"]) * Number(verse_range_transaction["count"]);
      }

      //TODO calculate read & review parts!!

    }


    scores = {"total": total, "today_total": today, "today_review": review_score, "today_read": read_score, "today_verses": today_verses, "total_verses": total_verses};
    
    //WHAT!!! \\O.O// never return an array of different variables, instead use map!!!
    return [total, today, review_score, read_score, today_verses, total_verses];
  }

  //VIEW
  function update_score () {
    get_memorization_data();
    var score_array = getScore();
    review_today = score_array[2];
    document.getElementById("score").textContent = "الرصيد الإجمالي: " + readableFormat(score_array[0]) + ", الآيات: " + format_readable_number(scores["total_verses"]);
    document.getElementById("today_score").textContent = "رصيد اليوم: " + readableFormat(score_array[1]) + ", الآيات: " + format_readable_number(scores["today_verses"]);
    document.getElementById("today_review_score").textContent = "* رصيد المراجعة: " + readableFormat(review_today) + " of [" + readableFormat(memorization_state["memorized"] / get_memorized_refresh_period_days()) +"]";
    document.getElementById("today_read_score").textContent = "* رصيد التلاوة: " + readableFormat(score_array[3]) + " of [" + readableFormat((memorization_state["not_memorized"] + memorization_state["was_memorized"] + memorization_state["being_memorized"]) / get_refresh_period_days()) +"]";;
    document.getElementById("review_debt").textContent = readableFormat(debts["review"]);
    document.getElementById("read_debt").textContent = readableFormat(debts["read"]);
    document.getElementById("total_debt").textContent = readableFormat(debts["read"] + debts["review"]);

    //TODO remove magic numbers and use constants instead!
    time_series_score_data(0);
    time_series_score_data(1);
    time_series_score_data(2);

    document.getElementById("highest_day_score").textContent = readableFormat(scores["day_high_score"]);
    document.getElementById("highest_month_score").textContent = readableFormat(scores["month_high_score"]);
    document.getElementById("highest_year_score").textContent = readableFormat(scores["year_high_score"]);

    animate_score();
  }

  async function animate_score() {
    document.getElementById("today_score").className = "score";
    //TODO test it!
    //document.getElementById("today_score").className = "score animated bounceIn";
    $("#today_score").addClass("animated bounceIn");
  }


  // الباقي يتم وضعه مع الآية الأولى
  // The remainder is added to the first verse only
  function verse_score(sura, verse){
    let score = Math.floor(suraCharCount[sura - 1] / suraVerseCount[sura - 1]);
    if (verse == 1) {
      score += suraCharCount[sura - 1] % suraVerseCount[sura - 1];
    }

    return score;
  }

  function verse_range_score(start_sura, start_verse, end_sura, end_verse){
    let char_count_score = 0;
    let verse_count_score = 0;

    if (start_sura == end_sura) {
      for(let verse = start_verse; verse <= end_verse; verse++){
        char_count_score += verse_score(start_sura, verse);
        verse_count_score++;
      }

      return {char_count: char_count_score, verse_count: verse_count_score };
    }
    //calculate first sura portion score
    for(let verse = start_verse; verse <= suraVerseCount[start_sura - 1]; verse++){
      char_count_score += verse_score(start_sura, verse);
      verse_count_score++;
    }

    //calcuate last sure partial scores
    if (end_verse == suraVerseCount[end_sura - 1]) {
      char_count_score += suraCharCount[end_sura - 1];
      verse_count_score += suraVerseCount[end_sura - 1];
    } else {
      for (let verse = 1; verse <= end_verse; verse++) {
        char_count_score += verse_score(end_sura, verse);
        verse_count_score++;
      }
    }
    
    //caculate full suras score sum
    if ((end_sura - start_sura) > 1) {
      for (let sura=(start_sura + 1); sura < end_sura; sura++) {
        char_count_score += suraCharCount[sura - 1];
        verse_count_score += suraVerseCount[sura - 1];
      }
    }

    let range_score = {char_count: char_count_score, verse_count: verse_count_score };

    return range_score;
  }
