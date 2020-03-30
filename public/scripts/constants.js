
//total score of all suras
const fullKhatmaCharCount = 322604;

const MEMORIZATION_STATE_NOT_MEMORIZED = "0";
const MEMORIZATION_STATE_WAS_MEMORIZED = "1";
const MEMORIZATION_STATE_MEMORIZED = "2";
const MEMORIZATION_STATE_BEING_MEMORIZED = "3";

const DAILY_SCORE_MODE = 0;
const MONTHLY_SCORE_MODE = 1;
const YEARLY_SCORE_MODE  = 2;
const DARK_DAYS_MODE = 3;
const LIGHT_DAYS_MODE = 4;

const SORT_ORDER_NORMAL = "normal";
const SORT_ORDER_REVELATION = "revelation_order";
const SORT_ORDER_LIGHT = "light";
const SORT_ORDER_CHAR_COUNT = "chars_count";
const SORT_ORDER_VERSE_COUNT = "verse_count";
const SORT_ORDER_WORD_COUNT = "word_count";
const SORT_ORDER_REFRESH_COUNT = "refresh_count";
const SCORE_CURRENCY = "$";

// Initialize Firebase
const config = {
    apiKey: "AIzaSyAn1GqNGEI3cB8pa5jBgaKxVdnf7xckw2c",
    authDomain: "quran-lights.firebaseapp.com",
    databaseURL: "https://quran-lights.firebaseio.com",
    projectId: "quran-lights",
    storageBucket: "quran-lights.appspot.com",
    messagingSenderId: "35819574492"
  };

  const SIGN_IN_ONLY_ELEMENTS = [
    "sort_order",
    "selected_total",
    "score",
    "light_days",
    "light-ratio-chart-container",
    "onquer-ratio-chart-container",
    "daily-score-chart",
    "monthly-score-chart",
    "yearly-score-chart",
    "dark_days_chart",
    "light_days_chart",
    "treemap-chart",
    "radar-chart",
    "khatma-progress-chart",
    "memorization-chart",
    "download",
    "import",
    "sort_order_container",
    "light_days_container",
    "daily-score-container",
    "today_score",
    "today_review_score",
    "today_read_score",
    "review_score_guage"
  ];

  const SIGN_OUT_ONLY_ELEMENTS = [
    "email",
    "password",
    "quickstart-sign-up",
    "sign-in-with-google",
    "quickstart-password-reset" 
  ];

  SINGLE_CLICK_EVENT_DAMPING_DELAY = 300; 
  MAX_ELAPSED_DAYS_FOR_MEMORIZED_SURAS=  10; 
  DAILY_REVIEW_SCORE_THRESHOLD = fullKhatmaCharCount / 3;
  NUMBER_OF_DECIMAL_DIGITS = 1;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const AUTO_REFRESH_PERIOD = 30 * 60 * 1000;