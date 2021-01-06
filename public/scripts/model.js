class Model {
    constructor() {}
  }
 
  class Verse {
    constructor(surah_number, verse_number) {
      this.surah_number = surah_number;
      this.verse_number = verse_number;
      this.refresh_history = [];
      this.memorization_history = [];

      //TODO get exact score later
      this.score = Math.floor(suraCharCount[surah_number] / suraVerseCount[surah_number]);
      if (verse_number == 1) {
        this.score += suraCharCount[surah_number] % suraVerseCount[surah_number];
      }
    }
  }

  class Surah {
      constructor(surah_number){
          this.surah_number = surah_number;
          this.surah_name = { en: SuraNamesEn[surah_number], ar: SuraNamesAr[surah_number]};
          this.score = suraCharCount[surah_number];
          this.refresh_history = [];
          this.memorization_history = [];
      }
  }

  class Page {
    constructor(page_number) {

    }

  }

  class Juz {

  }

  class Hezb {

  }

  class Quarter {

  }

  class Division {

  }