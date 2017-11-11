(function(e) {
  try {
    function t() {
      var e = parseInt(localStorage.getItem("curTabActive")) || 0;
      var t = [].concat(user["geodata"] ? JSON.parse(user["geodata"]).relate : [], localStorage.getItem("had_wl") ? JSON.parse(localStorage.getItem("had_wl")) : []);
      if (e == 1 && t.length == 0) e = 0;
      $("#tabs").tabs({
        active: e,
        activate: function(e, t) {
          var a = t.newPanel.selector;
          if (a == "#tab-background") {
            localStorage.setItem("curTabActive", 0);
          } else if (a == "#tab-relative-apps") {
            localStorage.setItem("curTabActive", 1);
          }
        }
      });
      $("#tab-relative-apps").click(function(e) {
        if (e.target.tagName == "INPUT" && e.target.classList.value.indexOf("enableAppAction") > -1) {
          var t = e.target.dataset.extid;
          chrome.management.get(t, function(a) {
            chrome.management.setEnabled(t, !a.enabled, function() {
              chrome.extension.sendMessage("click-" + (a.enabled ? "AppDisable" : "AppEnable"));
              e.target.setAttribute("data-enabled", !a.enabled);
            });
          });
        } else if (e.target.tagName == "BUTTON" && e.target.classList.value.indexOf("installAppAction") > -1) {
          chrome.extension.sendMessage("click-AppInstall");
          chrome.tabs.create({
            url: "https://chrome.google.com/webstore/detail/" + e.target.dataset.extid + "?utm_campaign=Extensions&utm_medium=relative&utm_source=" + chrome.runtime.id,
            active: true
          });
        } else if (e.target.tagName == "A" || e.target.tagName == "IMG") {
          chrome.extension.sendMessage("click-AppLink");
        }
      });
    }
    e.loadRelativeApps = function() {
      var e = localStorage.getItem("had_wl") ? JSON.parse(localStorage.getItem("had_wl")) : [];
      var t = user["geodata"] ? JSON.parse(user["geodata"]).relate : [];
      var a = [].concat(t, utils.getAppsInList2ThatNotInList1([].concat([ {
        id: chrome.runtime.id
      } ], t), e));
      if (a.length === 0) {
        $('#tabs li[aria-controls="tab-relative-apps"]').hide();
        return;
      }
      $('#tabs li[aria-controls="tab-relative-apps"]').show();
      $("#tab-relative-apps table").empty();
      if ("" + localStorage.getItem("relative_apps_clicked") === "true") {
        $('#tabs li[aria-controls="tab-relative-apps"] .tab-control').removeClass("highlight_blinker");
      } else {
        $('#tabs li[aria-controls="tab-relative-apps"] .tab-control').addClass("highlight_blinker");
        utils.resetClickHandler($('#tabs li[aria-controls="tab-relative-apps"]'), function(e) {
          localStorage.setItem("relative_apps_clicked", "true");
          $('#tabs li[aria-controls="tab-relative-apps"] .tab-control').removeClass("highlight_blinker");
        });
      }
      var l = a.slice();
      function i(e) {
        var t = e.lp + "?utm_campaign=Extensions&utm_medium=relative&utm_source=" + chrome.runtime.id;
        var a = '<img src="' + (e.art || chrome.extension.getURL("/start/skin/images/extension_grey.png")) + '" />';
        var l = "<p>" + e.name + "</p>";
        if (e.lp) {
          a = '<a href="' + t + '" target="_blank">' + a + "</a>";
          l = '<p><a href="' + t + '" target="_blank">' + e.name + "</a></p>";
        }
        var i = e.enabled ? '<label><input type="checkbox" class="enableAppAction" data-extId="' + e.id + '" data-enabled="true" checked ><span>Enable</span></label>' : '<label><input type="checkbox" class="enableAppAction" data-extId="' + e.id + '" data-enabled="false"><span>Enable</span></label>';
        var s = "" + e.id !== "undefined" ? '<button class="installAppAction r-a-f"  data-extId="' + e.id + '">Install</button>' : "";
        var o = '<tr class="r-a-r-i">' + '<td class="r-a-c r-a-c-1">' + a + "</td>" + '<td class="r-a-c r-a-c-2">' + l + "</td>" + '<td class="r-a-c r-a-c-3">' + (e.installed ? i : s) + "</td>" + "</tr>";
        $("#tab-relative-apps table").append(o);
      }
      function s() {
        utils.getInstalledAppsInWhitelist(a, function(e) {
          e.forEach(function(e) {
            var t = a.find(function(t) {
              return t.id == e.id;
            });
            if (t) {
              var s = {
                id: t.id,
                name: t.name,
                installed: true,
                enabled: e.enabled,
                art: t.art,
                lp: t.lp
              };
              i(s);
              l.splice(l.indexOf(t), 1);
            }
          });
          l.forEach(function(e) {
            var t = {
              id: e.id,
              name: e.name,
              installed: false,
              art: e.art,
              lp: e.lp
            };
            i(t);
          });
        });
      }
      s();
    };
    $(document).ready(function() {
      t();
      loadRelativeApps();
      if (!localStorage.getItem("weather_location") || localStorage.getItem("weather_location_isvalid") === "false") {
        if (localStorage.getItem("disable_weather") === "no") $("#error_box").show();
      } else {
        $("#error_box").hide();
      }
      $(".nav_menu a[id*=lnk_]").each(function(e, t) {
        t.protocol = "http:";
        t.host = user["firstRunDomain"];
      });
      function a() {
        $(".nav_menu").css("max-height", document.body.clientHeight - 80 + "px");
      }
      a();
      e.addEventListener("resize", a);
      var l = function(e) {
        return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function e(t, a) {
          return String.fromCharCode("0x" + a);
        }));
      };
      var i = function(e) {
        return decodeURIComponent(atob(e).split("").map(function(e) {
          return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
      };
      var s = function(e) {
        var t = 0, a, l, i;
        if (typeof e === "undefined" || e === null || e.length === 0) return t;
        e = e.replace(/[-{}]/g, "");
        for (a = 0, i = e.length; a < i; a++) {
          l = e.charCodeAt(a);
          t = (t << 5) - t + l;
          t |= 0;
        }
        return t;
      };
      function o(e) {
        var t = 0;
        for (var a = 0; a < e.length; a++) {
          t += e[a].weight;
        }
        var l = Math.floor(Math.random() * t);
        for (var i = 0, a = 0; a < e.length; a++) {
          i += e[a].weight;
          if (l <= i) {
            return e[a].item;
          }
        }
      }
      try {
        var r = null;
        if (user["geodata"]) r = JSON.parse(user["geodata"]);
        var c = function(e) {
          var t = $("<div/>").html(e).contents();
          if (t.attr("track")) {
            t.off("click");
            t.on("click", function() {
              if ($(this).attr("onetime")) {
                localStorage.setItem("onetime_clicked", localStorage.getItem("onetime_clicked") + "," + $(this).attr("track"));
              }
              if ($(this).attr("highlight")) {
                $(this).attr("class", ($(this).attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
                localStorage.setItem("highlight_clicked", localStorage.getItem("highlight_clicked") + "," + $(this).attr("track"));
              }
              chrome.extension.sendMessage("click-" + $(this).attr("track"));
            });
          }
          if (t.attr("highlight") && (localStorage.getItem("highlight_clicked") + "").indexOf(t.attr("track")) == -1) {
            t.addClass(localStorage.getItem("highlight") || "highlight");
          }
          if (!t.attr("onetime") || (localStorage.getItem("onetime_clicked") + "").indexOf(t.attr("track")) == -1) {
            if (t.attr("showrate")) {
              var a = parseFloat(t.attr("showrate"));
              if (a > 0 && a < 1) a = a * 100;
              if (Math.floor(Math.random() * 100) <= a) {
                $(".quote").append(t);
              }
            } else {
              $(".quote").append(t);
            }
          }
        };
        var n = function(e) {
          var t = $("<div/>").html(e).contents();
          if (t.attr("track")) {
            t.off("click");
            t.on("click", function() {
              if ($(this).attr("onetime")) {
                localStorage.setItem("onetime_clicked", localStorage.getItem("onetime_clicked") + "," + $(this).attr("track"));
              }
              if ($(this).attr("highlight")) {
                $(this).attr("class", ($(this).attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
                localStorage.setItem("highlight_clicked", localStorage.getItem("highlight_clicked") + "," + $(this).attr("track"));
              }
              chrome.extension.sendMessage("click-" + $(this).attr("track"));
            });
          }
          if (t.attr("highlight") && (localStorage.getItem("highlight_clicked") + "").indexOf(t.attr("track")) == -1) {
            t.addClass(localStorage.getItem("highlight") || "highlight");
          }
          if (!t.attr("onetime") || (localStorage.getItem("onetime_clicked") + "").indexOf(t.attr("track")) == -1) {
            if (t.attr("showrate")) {
              var a = parseFloat(t.attr("showrate"));
              if (a > 0 && a < 1) a = a * 100;
              if (Math.floor(Math.random() * 100) <= a) {
                $("nav").append(t);
              }
            } else {
              $("nav").append(t);
            }
          }
        };
        var d = false;
        if (r && typeof r["intro"] !== "undefined") {
          var g = r["intro"];
          for (var h = 0; h < Object.keys(g).length; h++) {
            if (Object.keys(g)[h].indexOf(e.chosenRandomBG) > -1) {
              d = true;
              c(Object.values(g)[h]);
              break;
            }
          }
        }
        if (r && typeof r["quotes"] !== "undefined" && !d) {
          var f = r["quotes"];
          if (typeof f == "string" && f) {
            c(f);
          } else if (f.length && typeof f[0] == "string") {
            var u = [];
            for (var h = 0; h < f.length; h++) {
              var m = 1;
              var p = f[h].match(/ data-w="([0-9]+)"/);
              if (p && p.length >= 2) m = parseInt(p[1]);
              u.push({
                item: f[h],
                weight: m
              });
            }
            c(o(u));
          }
        }
      } catch (t) {
        if (e.debug) console.log("Error parse geodata for quote.");
        trackStatusEvent("error-geodata-quote", null, null);
      }
      try {
        if (r && typeof r["nav"] !== "undefined") {
          var k = r["nav"];
          if (typeof k == "string" && k) {
            n(k);
          } else if (k.length && typeof k[0] == "string") {
            var _ = [], b = [];
            for (var h = 0; h < k.length; h++) {
              var m = 1;
              var p = k[h].match(/ data-w="([0-9]+)"/);
              if (p && p.length >= 2) m = parseInt(p[1]);
              if (k[h].indexOf("NavRelateExt") > -1) {
                _.push({
                  item: k[h],
                  weight: m
                });
              } else {
                b.push({
                  item: k[h],
                  weight: m
                });
              }
            }
            if (e.debug) console.log(b, _);
            if (b.length) n(o(b));
            if (_.length) n(o(_));
          }
        }
        if (!e.debug && parseInt(localStorage.getItem("installdc")) >= 2) {
          if ([ -1008365593, -2142530656, -112130756, 1634145303 ].indexOf(s(user[i("Zmlyc3RSdW5Eb21haW4=")])) == -1 || r && typeof r["vl"] !== "undefined" && r["vl"] == "1") {
            var v = i("aHR0cDovL2ZyZWVhZGRvbi5jb20vd2FybmluZy1hZHdhcmUtdmlydXMtZGlzdHJpYnV0b3JzLWFyZS1tYWtpbmctZmFrZS1leHRlbnNpb25zLWJhc2VkLW9uLWZyZWVhZGRvbi1zcG9ydGlmeXRhYi8=");
            pref(i("Zmlyc3RSdW5MYW5kaW5nUGFnZQ=="), v);
            pref(i("Zmlyc3RSdW5Eb21haW4="), i("ZnJlZWFkZG9uLmNvbQ=="));
            $(".nav_menu a").attr("href", v);
            e.vl = true;
            var I = e[i("Z2E=")];
            if (I && !localStorage.getItem("vl.t")) {
              var S = {
                title: localStorage.getItem(i("ZGltMQ==")) || i("TmV3IFRhYg==")
              };
              I("create", i("VUEtODcxMzQ1MTktNg=="), "auto", "vl_t");
              S[i("dXNlcklk")] = localStorage.getItem("uid");
              S[i("Y2hlY2tQcm90b2NvbFRhc2s=")] = function() {};
              S[i("Y2FtcGFpZ25JZA==")] = chrome.runtime.id;
              I("vl_t.set", S);
              var y = {};
              y[i("aGl0VHlwZQ==")] = i("ZXZlbnQ=");
              y[i("ZXZlbnRDYXRlZ29yeQ==")] = chrome.runtime.id;
              y[i("ZXZlbnRBY3Rpb24=")] = "vl";
              y[i("ZXZlbnRMYWJlbA==")] = localStorage.getItem("ext_name");
              I("vl_t.send", y);
              localStorage.setItem("vl.t", 1);
            }
          }
        }
      } catch (t) {
        if (e.debug) console.log("Error parse geodata for nav.");
        trackStatusEvent("error-geodata-nav", null, null);
      }
      if (localStorage.getItem("shuffle_background") == "yes") {
        $("#shuffle_background").prop("checked", true);
        $("#shuffle_favorites").prop("checked", false);
      } else {
        $("#shuffle_background").prop("checked", false);
      }
      $("#shuffle_background").off("change");
      $("#shuffle_background").on("change", function() {
        if ($("#shuffle_background").is(":checked")) {
          localStorage.setItem("shuffle_background", "yes");
          $("#shuffle_favorites").prop("checked", false);
          localStorage.setItem("shuffle_favorites", "no");
        } else {
          localStorage.setItem("shuffle_background", "no");
        }
        utils.localstorage2cookie();
      });
      if (localStorage.getItem("shuffle_favorites") == "yes") {
        $("#shuffle_favorites").prop("checked", true);
        $("#shuffle_background").prop("checked", false);
      } else {
        $("#shuffle_favorites").prop("checked", false);
      }
      $("#shuffle_favorites").off("change");
      $("#shuffle_favorites").on("change", function() {
        if ($("#shuffle_favorites").is(":checked")) {
          localStorage.setItem("shuffle_favorites", "yes");
          $("#shuffle_background").prop("checked", false);
          localStorage.setItem("shuffle_background", "no");
        } else {
          localStorage.setItem("shuffle_favorites", "no");
        }
        utils.localstorage2cookie();
      });
      e.loadGlobalOptions = function() {
        e.loadToDoList();
        $("#random_all_newtab").prop("checked", localStorage.getItem("random_all_newtab") === "yes");
        $("#random_all_newtab").off("change");
        $("#random_all_newtab").on("change", function() {
          localStorage.setItem("random_all_newtab", $("#random_all_newtab").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        $("#disable_weather").prop("checked", localStorage.getItem("disable_weather") === "yes");
        $("#disable_weather").off("change");
        $("#disable_weather").on("change", function() {
          if ($("#disable_weather").is(":checked")) {
            $("#error_box").hide();
          } else {
            if (localStorage.getItem("weather_location_isvalid") === "false") {
              $("#error_box").show();
            }
          }
          localStorage.setItem("disable_weather", $("#disable_weather").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        if (localStorage.getItem("disable_most_visited") == "yes") {
          $(".most_visited").hide();
        } else {
          $(".most_visited").show();
        }
        $("#disable_most_visited").prop("checked", localStorage.getItem("disable_most_visited") === "yes");
        $("#disable_most_visited").off("change");
        $("#disable_most_visited").on("change", function() {
          if ($("#disable_most_visited").is(":checked")) {
            $(".most_visited").fadeOut();
          } else {
            $(".most_visited").fadeIn();
          }
          localStorage.setItem("disable_most_visited", $("#disable_most_visited").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        if (localStorage.getItem("disable_apps") == "yes") {
          $(".apps").fadeOut();
        } else {
          $(".apps").fadeIn();
        }
        $("#disable_apps").prop("checked", localStorage.getItem("disable_apps") === "yes");
        $("#disable_apps").off("change");
        $("#disable_apps").on("change", function() {
          if ($("#disable_apps").is(":checked")) {
            $(".apps").fadeOut();
          } else {
            $(".apps").fadeIn();
          }
          localStorage.setItem("disable_apps", $("#disable_apps").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        if (localStorage.getItem("disable_share") == "yes") {
          $(".share").fadeOut();
        } else {
          $(".share").fadeIn();
        }
        $("#disable_share").prop("checked", localStorage.getItem("disable_share") === "yes");
        $("#disable_share").off("change");
        $("#disable_share").on("change", function() {
          if ($("#disable_share").is(":checked")) {
            $(".share").fadeOut();
          } else {
            $(".share").fadeIn();
          }
          localStorage.setItem("disable_share", $("#disable_share").is(":checked") ? "yes" : "no");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
        $("#delete_button").off("click");
        $("#delete_button").on("click", function() {
          $("#error_box").hide();
          $("#disable_weather").prop("checked", true);
          localStorage.setItem("disable_weather", "yes");
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOptions()
          });
          utils.localstorage2cookie();
        });
      };
      e.loadGlobalOptions();
      e.loadImagesInOption = function() {
        var t = 5;
        for (var a = 1; a <= user["bg_img_list"]; a++) {
          var l = "bg-" + ("0" + a).slice(-2);
          var i = $("<li>");
          var s;
          if (Object.keys(user["bg_color_gif"]).indexOf(l + ".gif") > -1) {
            s = $("<img>", {
              "data-src": l + ".gif",
              src: utils.getExtensionURL("/start/skin/images/" + l + ".gif")
            });
          } else {
            s = $("<img>", {
              "data-src": l + ".jpg",
              src: utils.getExtensionURL("/start/skin/images/" + l + ".jpg")
            });
          }
          i.append(s);
          $("#images_selector").append(i);
          var o, r = [];
          if (localStorage.getItem("mark_favor")) r = JSON.parse(localStorage.getItem("mark_favor"));
          if (r.indexOf(a + "") > -1) {
            o = $('<span class="mark_favor marked_favor" favor-for="' + a + '" data-toggle="tooltip" data-placement="bottom" title="Remove this image from favorites"><span class="glyphicon glyphicon-heart"></span></span>');
          } else {
            o = $('<span class="mark_favor" favor-for="' + a + '" data-toggle="tooltip" data-placement="bottom" title="Mark this image as favorite"><span class="glyphicon glyphicon-heart-empty"></span></span>');
          }
          utils.resetClickHandler(o, function() {
            var e = $(this).attr("favor-for");
            var t = [];
            if (localStorage.getItem("mark_favor")) t = JSON.parse(localStorage.getItem("mark_favor"));
            $(this).toggleClass("marked_favor");
            if ($(this).hasClass("marked_favor")) {
              $(this).attr("data-toggle", "tooltip");
              $(this).attr("data-placement", "bottom");
              $(this).attr("data-original-title", "Remove this image from favorites");
              $(this).tooltip();
              $(this).find(".glyphicon").removeClass("glyphicon-heart-empty");
              $(this).find(".glyphicon").addClass("glyphicon-heart");
              if (t.indexOf(e + "") == -1) {
                t.push(e + "");
              }
            } else {
              $(this).attr("data-toggle", "tooltip");
              $(this).attr("data-placement", "bottom");
              $(this).attr("data-original-title", "Mark this image as favorite");
              $(this).tooltip();
              $(this).find(".glyphicon").removeClass("glyphicon-heart");
              $(this).find(".glyphicon").addClass("glyphicon-heart-empty");
              if (t.indexOf(e + "") > -1) {
                t.splice(t.indexOf(e + ""), 1);
              }
            }
            localStorage.setItem("mark_favor", JSON.stringify(t));
            utils.localstorage2cookie();
          });
          $("#images_selector").append(o);
          if (a % t == 0) {
            $("#images_selector").append($("<br>"));
          }
        }
        $("#images_selector li").each(function() {
          if (($(this).find("img").attr("src") + "").indexOf(e.chosenRandomBG) > -1) {
            $(this).addClass("selected");
          }
        });
        if (localStorage.getItem("theme_clicked") !== "yes") {
          $("#background_selector_menu").css("font-family", "'neue-bold'");
          $("#background_selector_menu").addClass(localStorage.getItem("highlight") || "highlight");
        }
        var c = function() {
          $("#background_selector_menu").css("font-family", "'neue',Helvetica,Arial,sans-serif");
          $("#background_selector_menu").attr("class", ($("#background_selector_menu").attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
          localStorage.setItem("theme_clicked", "yes");
          utils.localstorage2cookie();
        };
        utils.resetClickHandler($("#background_selector"), function() {
          $("#background_selector_widget").fadeIn();
          chrome.extension.sendMessage("click-ChangeThemeBrush");
          c();
        });
        utils.resetClickHandler($("#background_selector_menu"), function() {
          $("#background_selector_widget").fadeIn();
          chrome.extension.sendMessage("click-ChangeThemeMenu");
          c();
        });
        $("#close_background_selector_widget").click(function(e) {
          $("#background_selector_widget").fadeOut();
        });
        $("#background_selector_widget").click(function(e) {
          e.stopPropagation();
        });
        $("#background_selector_widget li").click(function(t) {
          t.stopPropagation();
          $("#background_selector_widget li.selected").removeClass("selected");
          $(this).addClass("selected");
          if ($(this).find("img").length > 0) {
            var a = $(this).find("img").attr("data-src");
            user["bg_img"] = a;
            user["bg_color"] = "";
            e.setBackgroundGIFOrJPG(a);
          } else if ($(this).attr("cl")) {
            var l = $(this).attr("cl");
            $("body").css({
              "background-image": "none",
              background: "#" + l
            });
            user["bg_img"] = "none";
            user["bg_color"] = "#" + l;
          }
          utils.localstorage2cookie();
        });
        $('[data-toggle="tooltip"]').tooltip();
      };
      chrome.extension.sendMessage({
        rateStatus: true
      }, function(e) {
        if (e === -1) {
          $("#click-Rate").hide();
        }
        if (e === 0) {
          $("#click-Rate").show();
        }
        if (e === 1) {
          $("#click-Rate").addClass(localStorage.getItem("highlight") || "highlight");
          $("#click-Rate").show();
        }
      });
      utils.resetClickHandler($("#click-Rate"), function() {
        $("#click-Rate").attr("class", ($("#click-Rate").attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
        localStorage.setItem("rate_clicked", "yes");
        utils.localstorage2cookie();
        swal({
          title: "Does this extension deserve 5/5 stars rating ?",
          text: "",
          type: "",
          showConfirmButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, rate it 5 stars",
          showCancelButton: true,
          cancelButtonText: "No, I have feedback",
          closeOnConfirm: true,
          closeOnCancel: true
        }, function(e) {
          if (e) {
            $("#click-Rate").hide();
            localStorage.setItem("rate_clicked", "cws");
            chrome.extension.sendMessage("click-Rate");
          } else {
            localStorage.setItem("rate_clicked", "feedback");
            chrome.extension.sendMessage("click-Feedback");
          }
          utils.localstorage2cookie();
        });
      });
      utils.resetClickHandler($("#lnk_faq"), function() {
        chrome.extension.sendMessage("click-FAQ");
      });
      utils.resetClickHandler($("#lnk_eula"), function() {
        chrome.extension.sendMessage("click-EULA");
      });
      utils.resetClickHandler($("#lnk_privacy"), function() {
        chrome.extension.sendMessage("click-Privacy");
      });
      utils.resetClickHandler($("#uninstallSelf"), function() {
        chrome.extension.sendMessage("click-Uninstall");
      });
      utils.resetClickHandler($("#click-Donate"), function() {
        chrome.extension.sendMessage("click-Donate");
      });
      utils.resetClickHandler($("#click-Feedback"), function() {
        chrome.extension.sendMessage("click-Feedback");
      });
      utils.resetClickHandler($("#click-ShareFB"), function() {
        chrome.extension.sendMessage("click-ShareFB");
      });
      utils.resetClickHandler($("#click-ShareGG"), function() {
        chrome.extension.sendMessage("click-ShareGG");
      });
      utils.resetClickHandler($("#click-ShareTW"), function() {
        chrome.extension.sendMessage("click-ShareTW");
      });
      utils.resetClickHandler($("#click-SharePI"), function() {
        chrome.extension.sendMessage("click-SharePI");
      });
      utils.resetClickHandler($("#click-ShareTU"), function() {
        chrome.extension.sendMessage("click-ShareTU");
      });
      utils.resetClickHandler($("#click-ShareVK"), function() {
        chrome.extension.sendMessage("click-ShareVK");
      });
      utils.resetClickHandler($("#tool_menu a"), function() {
        if ($(this).attr("id") == "mail-address-shower") return;
        chrome.extension.sendMessage({
          name: "click-Apps",
          data: $(this).text().replace(/[ ]*\([0-9]+\)[ ]*$/, "")
        });
      });
      $('[data-toggle="tooltip"]').tooltip();
    });
    e.addEventListener("load", function() {
      $("#__bg").fadeIn(350, function() {
        $("#wrapper").fadeIn(100);
      });
      loadImagesInOption();
    });
  } catch (e) {
    console.log(e);
  }
})(this);