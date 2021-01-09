class Verse extends Quran_unit {
    constructor(surah_number, verse_number) {
      this.surah_number = surah_number;
      this.verse_number = verse_number;
    }

     //TODO get exact score later
     get_score() {
        var score = Math.floor(suraCharCount[this.surah_number] / suraVerseCount[this.surah_number]);
        if (this.verse_number == 1) {
          score += suraCharCount[this.surah_number] % suraVerseCount[this.surah_number];
        }

        return score;
    }

  }