function unrefresh(sura_index){
  //TODO: complete it!
  // console.log("sura_index ", sura_index);
  // var history_size = surasHistory[sura_index].history.length;
  // var refreshTimeStamp = surasHistory[sura_index].history(history_size - 1);
  // var transaction_record = {
  //   op: "unrefresh",
  //   sura: sura_index,
  //   time: refreshTimeStamp
  // };
  // //TODO: complete it!
  console.log("TODO: unrefresh selected sura: remove refresh entry ", transaction_record);
}

//TODO animate ony after score change
function animate_score_elements(){
  $(".score").addClass("animated bounceIn");
}

function refresh_by_name(suraName) {
  refresh_surah(SuraNamesEn.indexOf(suraName) + 1, Math.floor(Date.now() / 1000))
}

var buildingSurasFlag = false;

// firebase.initializeApp(config);

var timeStampTriggerTimerRef = null;
var periodicRefreshTimerRef = null;
var isFirstLoad = 1;

window.onload = function () {
  // Sentry.init({ dsn: 'https://55c264ec9a484103890f2ca7ad8a4543@sentry.io/238887' });
  init_collapsibles();
  initApp();
};

function set_light_days() {
  var light_days_selection_element = document.getElementById("light_days");
  var light_days_count = Number(light_days_selection_element.value);
  set_refresh_period_days(light_days_count);
  add_sura_cells();
}

function set_memorized_light_days() {
  var memorized_light_days_selection_element = document.getElementById("memorized_light_days");
  var memorized_light_days_count = Number(memorized_light_days_selection_element.value);
  set_memorized_refresh_period_days(memorized_light_days_count);
  add_sura_cells();
}

function setup_light_days_options() {
  var light_days_selection_element = document.getElementById("light_days");
  light_days_selection_element.innerHTML = "";
  for (var i = 1; i < 31; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    light_days_selection_element.appendChild(option);
  }

  light_days_selection_element.value = get_refresh_period_days();
}

function setup_memorized_light_days_options(){
  var memorized_light_days_selection_element = document.getElementById("memorized_light_days");
  memorized_light_days_selection_element.innerHTML = "";
  for (var i = 1; i < 31; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    memorized_light_days_selection_element.appendChild(option);
  }

  memorized_light_days_selection_element.value = get_memorized_refresh_period_days();
}

function setup_reverse_sort_order_checkbox(){
  document.getElementById('reverse_sura_sort_order_checkbox').checked = get_reverse_sort_order();
}

function show_sign_in_only_elements() {
  for (var i = 0; i < SIGN_IN_ONLY_ELEMENTS.length; i++) {
    var element = document.getElementById(SIGN_IN_ONLY_ELEMENTS[i]);
    if(element) element.style.display = "block";
  }

  // for (var i = 0; i < SIGN_OUT_ONLY_ELEMENTS.length; i++) {
  //   var element = document.getElementById(SIGN_OUT_ONLY_ELEMENTS[i]);
  //   if(element) element.style.display = "none";
  // }
}

function hide_sign_in_only_elements(){
  for (var i = 0; i < SIGN_IN_ONLY_ELEMENTS.length; i++) {
    var element = document.getElementById(SIGN_IN_ONLY_ELEMENTS[i]);
    if(element) element.style.display = "none";
  }

  for (var i = 0; i < SIGN_OUT_ONLY_ELEMENTS.length; i++) {
    var element = document.getElementById(SIGN_OUT_ONLY_ELEMENTS[i]);
    if(element) element.style.display = "block";
  }
}

function init_collapsibles() {
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}