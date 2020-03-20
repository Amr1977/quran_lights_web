const money_sound = "kaching.mp3";
const hamd_sound = "001002.mp3";
var audio = new Audio(money_sound);
function playSuraRefreshSound() {
  if (audio.paused) {
    audio.play();
  }
}