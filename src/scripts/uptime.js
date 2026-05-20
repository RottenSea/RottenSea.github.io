(function () {
  var start = new Date("2026-05-20T10:49:12+08:00");

  function pad(n) {
    return n.toString().padStart(2, "0");
  }

  function update() {
    var diff = Date.now() - start.getTime();
    if (diff < 0) {
      document.getElementById("uptime").textContent = "还没开始呢";
      return;
    }

    var totalSec = Math.floor(diff / 1000);
    var days = Math.floor(totalSec / 86400);
    var hours = Math.floor((totalSec % 86400) / 3600);
    var minutes = Math.floor((totalSec % 3600) / 60);
    var seconds = totalSec % 60;

    var text = "";
    if (days > 0) text += days + "d ";
    text += pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);

    document.getElementById("uptime").textContent = text;
  }

  update();
  setInterval(update, 1000);
})();
