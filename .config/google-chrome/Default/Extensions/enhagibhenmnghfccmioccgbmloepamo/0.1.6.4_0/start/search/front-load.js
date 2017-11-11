(function(e) {
  e.chosenRandomBG = "";
  e.setBackgroundGIFOrJPG = function(e) {
    var t = Object.keys(user["bg_color_gif"]).indexOf(e.replace(/\.jpg$/, ".gif"));
    if (t > -1) {
      chosenRandomBG = e.replace(/\.jpg$/, ".gif");
      document.getElementById("__bg").style.backgroundImage = "url(" + chrome.extension.getURL("/start/skin/images/" + chosenRandomBG) + ")";
      var o = Object.values(user["bg_color_gif"])[t];
      if (Math.floor(Math.random() * 100) < 10 || o.indexOf("frame") > -1 || o === "white" || o === "#ffffff") {
        var a = Math.floor(Math.random() * user["frame_bg_list"]);
        var g = "frame-bg-" + ("0" + a).slice(-2) + ".png";
        if (!document.getElementById("frame_bg")) {
          var n = document.createElement("div");
          n.setAttribute("id", "frame_bg");
          n.style = 'background-image: url("/start/skin/images/' + g + '"); width: 100%; height: 100%; background-repeat: no-repeat; background-size: 900px; background-position: center center;';
          document.getElementById("__bg").insertBefore(n, document.getElementById("__bg").childNodes[0]);
        }
        if (o.indexOf("frame") > -1 || o === "#ffffff") {
          o = o.replace("frame", "").replace(/[ ,\-]/g, "");
          if (!o || o === "white" || o === "#ffffff") o = "black";
        }
        document.getElementById("__bg").style.backgroundColor = o;
        document.getElementById("__bg").style.backgroundSize = "485px 320px";
      } else {
        if (document.getElementById("frame_bg")) document.getElementById("frame_bg").remove();
        document.getElementById("__bg").style.backgroundColor = o;
        document.getElementById("__bg").style.backgroundSize = "490px";
      }
    } else {
      chosenRandomBG = e.replace(/\.gif$/, ".jpg");
      document.getElementById("__bg").style.backgroundImage = "url(" + chrome.extension.getURL("/start/skin/images/" + chosenRandomBG) + ")";
      document.getElementById("__bg").style.backgroundColor = "none";
      document.getElementById("__bg").style.backgroundSize = "cover";
      if (document.getElementById("frame_bg")) {
        document.getElementById("frame_bg").remove();
      }
    }
  };
  var t = function() {
    var t = "" + localStorage.getItem("last_bg");
    var o = [], a = [];
    if (localStorage.getItem("mark_favor")) {
      o = JSON.parse(localStorage.getItem("mark_favor"));
      if (o.length >= 2 && o.indexOf(t) > -1) {
        o.splice(o.indexOf(t), 1);
      }
      if (o.length) a = o.join("|").split("|");
    }
    for (var g = 1; g <= user["bg_img_list"]; g++) {
      if ("" + g !== t) a.push("" + g);
    }
    if (localStorage.getItem("shuffle_background") == null) {
      chosenRandomBG = "bg-01.jpg";
      localStorage.setItem("shuffle_background", "yes");
      localStorage.setItem("shuffle_favorites", "no");
    } else if (localStorage.getItem("shuffle_background") == "yes" || localStorage.getItem("shuffle_favorites") == "yes" && o.length == 0) {
      if (localStorage.getItem("shuffle_favorites") == null) {
        localStorage.setItem("shuffle_favorites", "no");
      }
      var n = a[Math.floor(Math.random() * a.length)];
      chosenRandomBG = "bg-" + ("0" + n).slice(-2) + ".jpg";
      localStorage.setItem("last_bg", n);
    } else if (localStorage.getItem("shuffle_favorites") == "yes") {
      var n = o[Math.floor(Math.random() * o.length)];
      chosenRandomBG = "bg-" + ("0" + n).slice(-2) + ".jpg";
      localStorage.setItem("last_bg", n);
    } else {
      chosenRandomBG = "bg-01.jpg";
      localStorage.setItem("last_bg", 1);
    }
    e.setBackgroundGIFOrJPG(chosenRandomBG);
  };
  t();
})(this);