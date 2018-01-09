const showPot=function () {
  document.getElementById("Gif").style.visibility = "visible";
}
const hideGIF = function() {
  document.getElementById("Gif").style.visibility = "hidden";
  setTimeout(showPot, 500);
}
