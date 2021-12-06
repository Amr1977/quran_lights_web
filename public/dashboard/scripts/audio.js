const money_sound = "kaching.mp3";
const pulse_sound = "pulse_sound.mp3";
const water_drop_sound = "water_drop.mp3";
const error_sound_spring = "error_spring.mp3";
async function playSuraRefreshSound() {
  var audio = new Audio(money_sound);
  audio.play();
}

async function play_mouse_enter_sound() {
  var audio = new Audio(water_drop_sound);
  audio.play();
}

async function playSound(sound) {
  var audio = new Audio(sound);
  audio.play();
}