//to detect if control modifier key is pressed
var alt_pressed = false;
var shift_pressed = false;
function cacheIt(event) {
  alt_pressed = event.altKey;
  shift_pressed = event.shiftKey;
}
document.onkeydown = cacheIt;
document.onkeyup = cacheIt;