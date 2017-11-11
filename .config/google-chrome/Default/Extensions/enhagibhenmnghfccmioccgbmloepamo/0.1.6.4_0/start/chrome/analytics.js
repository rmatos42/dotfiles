(function(e) {
  var t = chrome.runtime.id;
  var a = chrome.i18n.getMessage("extName");
  var r = function(t) {
    if (e.debug) console.log("ga: send pageview " + t);
    ga("send", "pageview", t);
  };
  var o = function(t) {
    if (e.debug) console.log("ga: send event", t);
    if (t.eventAction.indexOf("active") > -1) ga("trackActive.send", t); else if (t.eventAction.indexOf("install") == 0 || t.eventAction.indexOf("update") == 0) ga("trackInstall.send", t); else if (t.eventAction.indexOf("click") == 0) ga("trackClick.send", t); else if (t.eventAction.indexOf("search") == 0) ga("trackSearch.send", t); else if (t.eventAction.indexOf("error") == 0) ga("trackError.send", t); else ga("send", t);
  };
  var l = function(t, r) {
    if (t != "opt-out" && t != "opted-out" && localStorage.getItem("optout") == "1") return;
    if (e.debug) console.log("TRACK: ", t, r); else {
      var l = {
        hitType: "event",
        eventCategory: a,
        eventAction: t
      };
      if (r) l.eventLabel = r;
      o(l);
    }
  };
  var c, i;
  var s = function() {
    var e = new Date();
    var t = "" + e.getUTCFullYear();
    var a = e.getUTCMonth() < 9 ? "0" + (e.getUTCMonth() + 1) : "" + (e.getUTCMonth() + 1);
    var r = e.getUTCDate() < 10 ? "0" + e.getUTCDate() : "" + e.getUTCDate();
    c = t + a + r;
    i = 0;
    var o = localStorage.getItem("installdt");
    if (!o) {
      localStorage.setItem("installdt", c);
    } else {
      try {
        var l = o.substr(0, 4);
        var s = o.substr(4, 2) - 1;
        var n = o.substr(6, 2);
        var g = new Date(l, s, n);
        var m = e.getTime() - g.getTime();
        i = Math.floor(m / (1e3 * 60 * 60 * 24));
      } catch (e) {}
    }
    localStorage.setItem("installdc", i);
  };
  function n() {
    var e = chrome.runtime.getManifest();
    return e.version;
  }
  function g() {
    var e = chrome.runtime.getManifest();
    return e.name;
  }
  var m = user["firstRunDomain"];
  var u = user["firstRunLandingPage"];
  var d = false, f = false;
  var h = n().split(".");
  var p = "http://" + m + "/update-" + h[0] + "-" + h[1] + "-" + h[2] + "/";
  var v = "update-" + h[0] + "-" + h[1] + "-" + h[2];
  var b = function(e, a) {
    l(e, a);
    var r = localStorage.getItem("confSE") || t;
    if (r.length === 32 && r.indexOf("://") === -1) r = "https://chrome.google.com/webstore/detail/" + n().replace(/\./g, "_") + "/" + r;
    if (e == "click-Rate") {
      var o = localStorage.getItem("confRE") || t;
      if (o.length === 32 && o.indexOf("://") === -1) o = "https://chrome.google.com/webstore/detail/" + o + "/reviews";
      chrome.tabs.create({
        url: o
      });
    } else if (e == "click-ChangeCity") {
      chrome.tabs.create({
        url: u + "?utm_campaign=Extensions&utm_medium=changecity&utm_source=" + chrome.runtime.id,
        active: true
      });
    } else if (e == "click-Feedback") {
      chrome.tabs.create({
        url: "http://" + user["firstRunDomain"] + "/feedback/?id=" + t
      }, function(e) {
        chrome.tabs.executeScript(e.id, {
          code: 'window.threadFeedback=setInterval(function(){ var feedbackName = document.getElementById("feedbackName"); if( feedbackName ){ clearInterval(window.threadFeedback); feedbackName.value = "' + g().replace(/'/g, "\\'").replace(/"/g, '\\"') + '"; } },1000)',
          allFrames: false,
          runAt: "document_start"
        });
      });
    } else if (e == "click-ShareFB") {
      chrome.tabs.create({
        url: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(r)
      });
    } else if (e == "click-ShareGG") {
      chrome.tabs.create({
        url: "https://plus.google.com/share?url=" + encodeURIComponent(r)
      });
    } else if (e == "click-ShareTW") {
      chrome.tabs.create({
        url: "http://www.twitter.com/share?url=" + encodeURIComponent(r)
      });
    } else if (e == "click-SharePI") {
      chrome.tabs.create({
        url: "https://pinterest.com/pin/create/bookmarklet/?url=" + encodeURIComponent(r)
      });
    } else if (e == "click-ShareTU") {
      chrome.tabs.create({
        url: "https://www.tumblr.com/widgets/share/tool?canonicalUrl=" + encodeURIComponent(r)
      });
    } else if (e == "click-ShareVK") {
      chrome.tabs.create({
        url: "http://vk.com/share.php?url=" + encodeURIComponent(r)
      });
    } else if (e == "click-Donate") {
      var c = "http://" + user["firstRunDomain"] + "/donate/?id=" + t;
      chrome.tabs.create({
        url: c
      });
    } else if (e == "click-Uninstall") {
      chrome.management.uninstallSelf({
        showConfirmDialog: true
      }, function(e) {});
    }
  };
  var S = [];
  chrome.tabs.onUpdated.addListener(function(t, a, r) {
    if ((a.status == "complete" || S.indexOf(t) == -1) && (r.url.replace(/^https?:\/\//, "").indexOf(u.replace(/^https?:\/\//, "")) > -1 || r.url.replace(/^https?:\/\//, "").indexOf(p.replace(/^https?:\/\//, "")) > -1)) {
      S.push(t);
      chrome.tabs.executeScript(t, {
        file: "/start/search/content-homepage.js",
        allFrames: false,
        runAt: "document_start"
      }, function() {
        if (e.debug) chrome.tabs.sendMessage(t, {
          debug: e.debug
        });
        if (d && r.url.replace(/^https?:\/\//, "").indexOf(p.replace(/^https?:\/\//, "")) > -1) {
          chrome.tabs.sendMessage(t, {
            type: "showMajor"
          });
        } else if (f) {
          chrome.tabs.sendMessage(t, {
            type: "showInstall"
          });
        } else {
          chrome.tabs.sendMessage(t, {
            type: "showMinor"
          });
        }
        var a = JSON.parse(localStorage.getItem("weather_location"));
        var o = JSON.parse(localStorage.getItem("weather_data"));
        var l = localStorage.getItem("weather_location_isvalid") === "true";
        if (l) {
          chrome.tabs.sendMessage(t, {
            type: "weather_info",
            info: {
              weather_location: a,
              weather_data: o
            }
          });
        } else {
          chrome.tabs.sendMessage(t, {
            type: "error_get_weather_in_city",
            info: {
              weather_location: JSON.parse(localStorage.getItem("weather_location")),
              error_msg: "Unable to get weather data."
            }
          });
        }
      });
    }
  });
  function w(t) {
    if (e.debug) console.log("Extension Installed");
    l("installed");
    if (localStorage.getItem("installdt") === null) {
      localStorage.setItem("installdt", c);
    }
    x();
    f = true;
    chrome.tabs.create({
      url: localStorage.getItem("newtab_url"),
      active: false
    }, function() {});
    chrome.tabs.query({
      url: [ "http://" + m + "/*", "https://" + m + "/*", "http://www." + m + "/*", "https://www." + m + "/*" ]
    }, function(e) {
      if (e.length) {
        chrome.tabs.update(e[0].id, {
          url: u,
          active: true
        });
      } else {
        chrome.tabs.create({
          url: u,
          active: true
        });
      }
    });
    setTimeout(function() {
      l("install-alive");
    }, 15e3);
  }
  function I(t, a) {
    if (e.debug) console.log("Extension Updated");
    l("updated" + "-" + t);
    try {
      x();
      if ((user["ver_update_ignore"] + "").indexOf(a) >= 0) {
        return;
      }
      if ((user["ver_update_major"] + "").indexOf(t) >= 0) {
        chrome.cookies.get({
          url: p,
          name: v
        }, function(e) {
          if (e) return;
          d = true;
          chrome.tabs.query({
            url: [ "http://" + m + "/*", "https://" + m + "/*", "http://www." + m + "/*", "https://www." + m + "/*" ]
          }, function(e) {
            if (e.length) {
              chrome.tabs.update(e[0].id, {
                url: p,
                active: true
              });
            } else {
              chrome.tabs.create({
                url: p,
                active: true
              });
            }
          });
        });
      } else if (i >= 3 && (user["ver_update_minor"] + "").indexOf(t) >= 0) {
        chrome.tabs.query({
          url: [ "http://" + m + "/*", "https://" + m + "/*", "http://www." + m + "/*", "https://www." + m + "/*" ]
        }, function(e) {
          if (e.length) {
            chrome.tabs.update(e[0].id, {
              url: u,
              active: true
            });
          } else {
            chrome.tabs.create({
              url: u,
              active: true
            });
          }
        });
      }
      if ((user["ver_reset_clicked_options"] + "").indexOf(t) >= 0) {
        localStorage.removeItem("theme_clicked");
      }
    } catch (e) {}
  }
  function _(t, a) {
    if (e.debug) console.log("Extension Active");
    if (localStorage.getItem("optout") === "1") {
      l("opted-out", a);
    } else {
      l("active", a);
    }
  }
  s();
  e.currVersion = e.currVersion || n();
  e.prevVersion = e.prevVersion || localStorage.getItem("version") || localStorage.getItem("installed");
  if (currVersion != prevVersion) {
    if (prevVersion === null) {
      w(currVersion);
    } else {
      localStorage.setItem("instact", 1);
      I(currVersion, prevVersion);
    }
    localStorage.setItem("version", currVersion);
  }
  var k = localStorage.getItem("last_active");
  e.last_active = false;
  if (!k || k !== c) {
    if (k) localStorage.setItem("instact", 1);
    _(currVersion, i);
    localStorage.setItem("last_active", c);
    e.last_active = true;
  }
  chrome.extension.onMessage.addListener(function(e, t, a) {
    if (typeof e == "string" && e.indexOf("click-") == 0) {
      b(e);
      return;
    } else if (typeof e.name == "string" && e.name.indexOf("click-") == 0) {
      b(e.name, e.data);
      return;
    } else if (e.search) {
      l(e.search, e.query);
      a("ok");
      return;
    } else if (e.rateStatus) {
      if (i < 1) {
        a(0);
      } else if (localStorage.getItem("rate_clicked") == null) {
        a(1);
      } else if (localStorage.getItem("rate_clicked") == "yes" || localStorage.getItem("rate_clicked") == "feedback") {
        a(0);
      } else if (localStorage.getItem("rate_clicked") == "cws") {
        a(-1);
      }
    }
  });
  function x() {
    if (!localStorage.getItem("disable_weather")) {
      localStorage.setItem("disable_weather", "no");
    }
    if (!localStorage.getItem("disable_most_visited")) {
      localStorage.setItem("disable_most_visited", "no");
    }
    if (!localStorage.getItem("disable_apps")) {
      localStorage.setItem("disable_apps", "no");
    }
    if (!localStorage.getItem("disable_share")) {
      localStorage.setItem("disable_share", "no");
    }
    if (!localStorage.getItem("disable_todo")) {
      localStorage.setItem("disable_todo", "no");
    }
    if (!localStorage.getItem("hideTodoPanel")) {
      localStorage.setItem("hideTodoPanel", "yes");
    }
    if (!localStorage.getItem("todoList")) {
      localStorage.setItem("todoList", "[]");
    }
    if (!localStorage.getItem("had_wl")) {
      localStorage.setItem("had_wl", "[]");
    }
    if (!localStorage.getItem("random_all_newtab")) {
      localStorage.setItem("random_all_newtab", "no");
    }
    if (!localStorage.getItem("last_opened")) {
      localStorage.setItem("last_opened", new Date().getTime());
    }
    if (!localStorage.getItem("bg_img")) localStorage.setItem("bg_img", "bg-01.jpg");
    localStorage.setItem("bg_img", localStorage.getItem("bg_img").replace("url(", "").replace("/start/skin/images/", "").replace("/skin/images/", "").replace(")", ""));
  }
})(this);