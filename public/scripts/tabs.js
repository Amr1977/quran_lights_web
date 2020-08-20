function openTab(evt, id) {
    turn_all_tbs_off();

    document.getElementById(id).style.display = "block";
    evt.currentTarget.className += " active";
  }

  function click_light_cells_tab(){
    turn_all_tbs_off();
    document.getElementById("light_cells").style.display = "block";
    document.getElementById("cells_link").className += " active";
  }

  function turn_all_tbs_off() {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  }