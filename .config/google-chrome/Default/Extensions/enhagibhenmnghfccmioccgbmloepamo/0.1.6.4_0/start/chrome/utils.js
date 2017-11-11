(function(e) {
  "use strict";
  function t(e) {
    return localStorage[e];
  }
  function n(e, t) {
    localStorage[e] = t;
  }
  function a(e) {
    localStorage.clear();
  }
  var r = navigator.languages[0] || navigator.language;
  var o = r.substr(0, 2);
  var i = function() {
    var e = navigator.userAgent.toLowerCase();
    if (/x11; cros /.test(e)) {
      return "chromeOS";
    } else if (/macintosh; intel mac os x /.test(e)) {
      return "macOS";
    } else if (/x11; .*; linux /.test(e)) {
      return "linux";
    } else if (/windows nt 5.0/.test(e)) {
      return "winXP";
    } else if (/windows nt 6.0/.test(e)) {
      return "winVista";
    } else if (/windows nt 6.1/.test(e)) {
      return "win7";
    } else if (/windows nt 6.2/.test(e)) {
      return "win8";
    } else if (/windows nt 6.3/.test(e)) {
      return "win8.1";
    } else if (/windows nt 10.0/.test(e)) {
      return "win10";
    }
  }();
  var l = {
    get os() {
      return i;
    },
    get id() {
      var e = localStorage.getItem("ext_id") || chrome.app.getDetails().id;
      return e;
    },
    get id4() {
      var e = localStorage.getItem("ext_id") || chrome.app.getDetails().id;
      return e.substring(0, 4);
    },
    get version() {
      var e = localStorage.getItem("version") || chrome.app.getDetails().version;
      return e;
    },
    get locale() {
      return r;
    },
    get language() {
      return o;
    },
    get: function(e) {
      return t(e);
    },
    set: function(e, t) {
      n(e, t);
    },
    remove: function(e) {
      delete localStorage[e];
    },
    yymmdd: function() {
      try {
        var e = new Date();
        return (e.getUTCFullYear() + "").slice(-2) + ("0" + (e.getUTCMonth() + 1)).slice(-2) + ("0" + e.getUTCDate()).slice(-2) + ("0" + e.getUTCHours()).slice(-2);
      } catch (e) {}
    },
    count: function(e) {
      var t = this.get(e);
      if (t == null) t = 1; else t++;
      this.set(e, t);
    },
    mark_time: function(e) {
      this.set(e, new Date().getTime());
    },
    resetMouseEnterHandler: function(e, t) {
      e.off("mouseenter");
      e.on("mouseenter", t);
    },
    resetClickHandler: function(e, t) {
      e.off("click");
      e.on("click", t);
    },
    getExtensionURL: function(e) {
      return chrome.extension.getURL(e);
    },
    getGlobalOptions: function() {
      return {
        disable_weather: localStorage.getItem("disable_weather"),
        disable_most_visited: localStorage.getItem("disable_most_visited"),
        disable_apps: localStorage.getItem("disable_apps"),
        disable_share: localStorage.getItem("disable_share"),
        disable_todo: localStorage.getItem("disable_todo"),
        hideTodoPanel: localStorage.getItem("hideTodoPanel"),
        todoList: localStorage.getItem("todoList"),
        had_wl: localStorage.getItem("had_wl"),
        random_all_newtab: localStorage.getItem("random_all_newtab")
      };
    },
    getInstalledAppsInWhitelist: function(e, t) {
      chrome.management.getAll(function(n) {
        var a = [];
        for (var r = 0; r < e.length; r++) {
          var o = e[r];
          for (var i = 0; i < n.length; i++) {
            var l = n[i];
            if (o.id === l.id) {
              a.push(l);
            }
          }
        }
        t(a);
      });
    },
    getEnabledAppsInWhitelist: function(e, t) {
      chrome.management.getAll(function(n) {
        var a = [];
        for (var r = 0; r < e.length; r++) {
          var o = e[r];
          for (var i = 0; i < n.length; i++) {
            var l = n[i];
            if (l.enabled && o.id === l.id) {
              a.push(l);
            }
          }
        }
        t(a);
      });
    },
    getAppsInList2ThatNotInList1: function(e, t) {
      var n = [];
      for (var a = 0; a < t.length; a++) {
        var r = true;
        for (var o = 0; o < e.length; o++) {
          if (t[a].id === e[o].id) {
            r = false;
            break;
          }
        }
        if (r) n.push(t[a]);
      }
      return n;
    },
    localstorage2cookie: function() {}
  };
  e.utils = l;
  e.debug = localStorage.getItem("debug") === "debug";
  if (chrome.management && chrome.management.getSelf) {
    chrome.management.getSelf(function(t) {
      if (t.installType === "development") {
        e.debug = true;
        localStorage.setItem("debug", "debug");
      } else {
        e.debug = false;
        localStorage.removeItem("debug");
      }
    });
  }
})(this);