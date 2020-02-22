var audio = new Audio("001002.mp3");
function playSuraRefreshSound() {
  if (audio.paused) {
    audio.play();
  }
}