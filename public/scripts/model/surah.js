class Surah extends Quran_unit {
    constructor (surah_number){
        this.surah_number = surah_number;
        this.name = {arabic: SuraNamesEn[surah_number], english: SuraNamesEn[surah_number]};
        this.score = suraCharCount[surah_number];
    }

    

    
}