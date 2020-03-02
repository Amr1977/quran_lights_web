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
}
document.onkeydown = cacheIt;
document.onkeyup = cacheIt;