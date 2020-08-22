const money_sound = "kaching.mp3";
const pulse_sound = "pulse_sound.mp3";
async function playSuraRefreshSound() {
  var audio = new Audio(money_sound);
  audio.play();
}

async function play_mouse_enter_sound() {
  var audio = new Audio(pulse_sound);
  audio.play();
}

async function playSound(sound) {
  var audio = new Audio(sound);
  audio.play();
}