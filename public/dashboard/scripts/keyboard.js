//to detect if control modifier key is pressed
var alt_pressed = false;
var shift_pressed = false;
var ctrl_pressed = false;
var cmd_pressed = false;

function modifier_keys_state() {
  return {
    "alt_pressed": alt_pressed,
    "shift_pressed": shift_pressed,
    "ctrl_pressed": ctrl_pressed,
    "cmd_pressed": cmd_pressed
  };
}
function cacheIt(event) {
  alt_pressed = event.altKey;
  shift_pressed = event.shiftKey;
  ctrl_pressed = event.ctrlKey;
  cmd_pressed = event.metaKey;
  console.log(modifier_keys_state());
  if (event.key == "l" && event.type == "keyup") {
    set_sort_order_with_value("light");
    add_sura_cells();
  }

  if (event.key == "n" && event.type == "keyup") {
    set_sort_order_with_value("normal");
    add_sura_cells();
  }

  if (event.key == "c" && event.type == "keyup") {
    set_sort_order_with_value("chars_count");
    add_sura_cells();
  }

  if (event.key == "v" && event.type == "keyup") {
    set_sort_order_with_value("verse_count");
    add_sura_cells();
  }

  if (event.key == "w" && event.type == "keyup") {
    set_sort_order_with_value("word_count");
    add_sura_cells();
  }

  if (event.key == "f" && event.type == "keyup") {
    set_sort_order_with_value("refresh_count");
    add_sura_cells();
  }

  if (event.key == "r" && event.type == "keyup") {
    set_sort_order_with_value("revelation_order");
    add_sura_cells();
  }

  if (event.key == "d" && event.type == "keyup") {
    deselectAll();
  }

  if (event.key == "x" && event.type == "keyup") {
    apply_reverse_sort_order();
    add_sura_cells();
  }

}
document.onkeydown = cacheIt;
document.onkeyup = cacheIt;