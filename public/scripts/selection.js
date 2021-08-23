function updateDeselectButton(){
  if (selected_suras.length > 0) {
    document.getElementById("deselect_button").style.display = "block";
  } else {
    //document.getElementById("deselect_button").style.display = "none";
  }
}

function toggle_select(suraIndex) {
    var index = selected_suras.indexOf(suraIndex);
    if (index !== -1) {
      selected_suras.splice(index, 1);
      $(".sura-" + suraIndex).removeClass("selected");
      if (is_old_refresh(suraIndex)) {
          $(".sura-" + suraIndex).addClass("old-refresh");
      }
    } else {
      selected_suras.push(Number(suraIndex));
      $(".sura-" + suraIndex).removeClass("old-refresh");
      $(".sura-" + suraIndex).addClass("selected");
    }
    set_local_storage_object("selected_suras", selected_suras);
    update_selection_score();
  }

  //update selected_total element with total selected suras score
  function update_selection_score() {
    var selected_total = 0;
  
    for (var i = 0; i < selected_suras.length;  i++) {
      selected_total += suraCharCount[selected_suras[i] - 1];
    }
  
    document.getElementById("selected_total").textContent = " Selected Amount: [" + readableFormat(selected_total) + "]";
  }

  function deselectAll() {
    if (selected_suras.length == 0) return;
    for (var index = 0; index < selected_suras.length; index++) {
      $(".sura-" + selected_suras[index]).removeClass("selected");
      if (is_old_refresh(selected_suras[index])) {
          $(".sura-" + selected_suras[index]).addClass("old-refresh");
      }
    }

    selected_suras = [];
    set_local_storage_object("selected_suras", selected_suras);
    update_selection_score();
  }

  function is_old_refresh(sura_index) {
    var timeStampsArray = surasHistory[sura_index].history;
    var currentTimeStamp = Math.floor(Date.now() / 1000);

    var maxStamp = timeStampsArray.length > 0
      ? timeStampsArray[timeStampsArray.length - 1]
      : get_initial_local_object("min_timestamp", currentTimeStamp);

    var daysElapsed = ((currentTimeStamp - maxStamp) /
      (60 * 60 * 24.0)).toFixed(0);
    return  (daysElapsed >= get_refresh_period_days());
  }