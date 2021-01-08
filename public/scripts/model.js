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

  /**
   * If page belongs to one Surah then only Surah number, starting verse and ending verse of the page, 
   * otherwise it will need 4 indeces, that is starting surah, starting verse, ending surah, ending verse
   */
  const page_verse_lookup_table = {
    1: [1, 1, 7],
    2: [2, 1, 5],
    3: [2, 6, 16],
    4: [2, 17, 24],
    5: [2, 25, 29],
    6: [2, 30, 37],
    7: [2, 38, 48],
    8: [2, 49, 57],
    9: [2, 58, 61],
    10: [2, 62, 69],
    11: [2, 70, 76],
    12: [2, 77, 83],
    13: [2, 84, 88],
    14: [2, 89, 93],
    15: [2, 94, 101],
    16: [2, 102, 105],
    17: [2, 106, 112],
    18: [2, 113, 119],
    68: [3,141 ,148],
    69: [153],
    70: [157],
    71: [165],
    71: [165],
    


}

const quarter_verse_lookup_table = {

}

const juz_verse_lookup_table = {
1: [1, 1, 2, 141],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
2: [2, 142, 2, 252],
30: [2, 142, 2, 252]


}

  