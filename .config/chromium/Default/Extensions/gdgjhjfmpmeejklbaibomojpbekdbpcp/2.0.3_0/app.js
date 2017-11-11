var App = new (function() {

  this.isEnabled = function() {
    return localStorage.wurstifyEnabled == "true";
  }

  this.setEnabled = function(enabled) {
    if(enabled) {
      localStorage.wurstifyEnabled = "true";
    }
    else {
      localStorage.wurstifyEnabled = "false";
    }

    this.updateIcon();
  }

  this.updateIcon = function() {
    if(this.isEnabled()) {
      browser.browserAction.setIcon({
        path: "img/icon38.png"
      });
    }
    else {
      browser.browserAction.setIcon({
        path: "img/icon38_disabled.png"
      });
    }
  }

  this.updateIcon();
});

browser.browserAction.onClicked.addListener(function(tab) {
  askForNotificationPermission(function(notificationsGranted) {
    App.setEnabled(!App.isEnabled());

    if(notificationsGranted) {
      if(App.isEnabled()) {
        browser.notifications.create("status-changed", {
          type: "basic",
          title: "Wurstify enabled",
          message: "Enjoy your beards!",
          iconUrl: "img/icon128.png"
        });
      }
      else {
        browser.notifications.create("status-changed", {
          type: "basic",
          title: "Wurstify disabled",
          message: "Enough beards (for now)",
          iconUrl: "img/icon128.png"
        });
      }
    }

    browser.tabs.reload(tab.id, {bypassCache: true});
  });
});

function disableDueToRateLimit(retryIn) {
  if(App.isEnabled()) {
    App.setEnabled(false);
    canShowNotification(function(notificationsGranted) {
      if(notificationsGranted) {
        var retryHint = "Please retry later.";
        if(retryIn) {
          retryHint = "Please retry in " + formatTime(retryIn) + ".";
        }
        browser.notifications.create("status-changed", {
          type: "basic",
          title: "Shaved by accident ⚡",
          message: "OH NO - Wurstify is running hot! " + retryHint,
          iconUrl: "img/icon128.png"
        });
      }
    });
  }
}

function formatTime(time) {
  var days = Math.floor(time / (60*60*24));
  var hours = Math.floor(time / (60*60)) % (60*60*24);
  var minutes = Math.floor(time / 60) % (60*60);
  var seconds = time % 60;
  var elements = [];
  if(days > 0) {
    elements.push(days + " day" + (days != "1" ? "s" : ""));
  }
  if(hours > 0) {
    elements.push(hours + " hour" + (hours != "1" ? "s" : ""));
  }
  if(minutes > 0) {
    elements.push(minutes + " minute" + (minutes != "1" ? "s" : ""));
  }
  if(seconds > 0) {
    elements.push(seconds + " second" + (seconds != "1" ? "s" : ""));
  }
  if(elements.length == 0) {
    return "1 second"; // in case it's < 1 second
  }
  else if(elements.length == 1) {
    return elements[0];
  }
  else if(elements.length == 2) {
    return elements[0] + " and " + elements[1];
  }
  else if(elements.length == 3) {
    return elements[0] + ", " + elements[1] + " and " + elements[2];
  }
  else if(elements.length == 4) {
    return elements[0] + ", " + elements[1] + ", " + elements[2] + " and " + elements[3];
  }
}

function canShowNotification(callback) {
  browser.permissions.contains({
    permissions: ['notifications']
  }, callback);
}

function askForNotificationPermission(callback) {
  browser.permissions.request({
    permissions: ['notifications']
  }, callback);
}

