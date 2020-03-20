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
    } else {
      selected_suras.push(Number(suraIndex));
    }
    setLocalStorageObject("selected_suras", selected_suras);
    addSuraCells();
  }

  //update selected_total element with total selected suras score
  function update_selection_score() {
    var selected_total = 0;
  
    for (var i = 0; i < selected_suras.length;  i++) {
      selected_total += suraCharCount[selected_suras[i] - 1];
    }
  
    document.getElementById("selected_total").textContent = " Selected Amount: [" + SCORE_CURRENCY + readableFormat(selected_total) + "]";
  }

  function deselectAll() {
    selected_suras = [];
    setLocalStorageObject("selected_suras", selected_suras);
    //document.getElementById("deselect_button").style.display = "none";
    addSuraCells();
  }