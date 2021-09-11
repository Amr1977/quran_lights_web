
//total score of all suras
const full_khatma_char_count = 322604;

const MEMORIZATION_STATE_NOT_MEMORIZED = "0";
const MEMORIZATION_STATE_WAS_MEMORIZED = "1";
const MEMORIZATION_STATE_MEMORIZED = "2";
const MEMORIZATION_STATE_BEING_MEMORIZED = "3";

const DAILY_SCORE_MODE = 0;
const MONTHLY_SCORE_MODE = 1;
const YEARLY_SCORE_MODE  = 2;
const DARK_DAYS_MODE = 3;
const LIGHT_DAYS_MODE = 4;
const REFRESH_COUNT_TIME_SCORE_MODE = 5;

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
    apiKey: "AIzaSyAEdMiadM_2s39jcHnirT1HPZnXBg3bk6k",
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
    "review_score_guage",
    "daily-read-guage"
  ];

  const SIGN_OUT_ONLY_ELEMENTS = [
    "email",
    "password",
    "quickstart-sign-up",
    "sign-in-with-google",
    "quickstart-password-reset" ,
    "sign-in-with-facebook",
    "sign-in-with-twitter"
  ];

  SINGLE_CLICK_EVENT_DAMPING_DELAY = 300; 
  MAX_ELAPSED_DAYS_FOR_MEMORIZED_SURAS = 3;
  LIGHT_DAYS = 7;
  DAILY_REVIEW_SCORE_THRESHOLD = full_khatma_char_count / 3;
  NUMBER_OF_DECIMAL_DIGITS = 1;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const AUTO_REFRESH_PERIOD = 30 * 60 * 1000;

  document.constants = true;

  window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };
  
  const is_mobile = window.mobileCheck();

  // Start uploading after 10 seconds of last enqueue
const UPLOAD_DISPATCH_DAMPING_DELAY = 3_000;