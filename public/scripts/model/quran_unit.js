
class Quran_unit {

  constructor (start_surah, start_verse, end_surah, end_verse) {

  }

  get_verse_list(){

  }

  get_refresh_history() {

  }

  set_refresh_history() {

  }

  get_hefz_history() {

  }

  set_hefz_history() {

  }

  get_last_refresh() {

  }

  set_last_refresh() {

  }

  get_score() {
    console.log("get_score: undefined for ", this);
    return 0;
  }
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

  