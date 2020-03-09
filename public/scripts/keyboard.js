//to detect if control modifier key is pressed
var alt_pressed = false;
var shift_pressed = false;
var ctrl_pressed = false;
var cmd_pressed = false;
function cacheIt(event) {
  alt_pressed = event.altKey;
  shift_pressed = event.shiftKey;
  ctrl_pressed = event.ctrlKey;
  cmd_pressed = event.metaKey;
  console.log(event);
  if (event.key == "l" && event.type == "keyup" && event.ctrlKey) {
    set_sort_order_with_value("light");
  }

  if (event.key == "n" && event.type == "keyup" && event.ctrlKey) {
    set_sort_order_with_value("normal");
  }

  if (event.key == "c" && event.type == "keyup" && event.ctrlKey) {
    set_sort_order_with_value("chars_count");
  }

  if (event.key == "v" && event.type == "keyup" && event.ctrlKey) {
    set_sort_order_with_value("verse_count");
  }

  if (event.key == "w" && event.type == "keyup" && event.ctrlKey) {
    set_sort_order_with_value("word_count");
  }

  if (event.key == "f" && event.type == "keyup" && event.ctrlKey) {
    set_sort_order_with_value("refresh_count");
  }

  if (event.key == "r" && event.type == "keyup" && event.ctrlKey) {
    set_sort_order_with_value("revelation_order");
  }

}
document.onkeydown = cacheIt;
document.onkeyup = cacheIt;