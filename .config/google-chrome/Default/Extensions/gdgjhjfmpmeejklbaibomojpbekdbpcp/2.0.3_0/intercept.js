var requests = {};

var emptyPixelPngDataUrl = "data:image/png,base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

var urlRegexp = new RegExp([
    '^(https?:)//', // protocol
    '(([^:/?#]*)(?::([0-9]+))?)', // host (hostname and port)
    '(/[^?#]*)', // pathname
    '(\\?[^#]*|)', // search
    '(#.*|)$' // hash
].join(''));

browser.webRequest.onBeforeRequest.addListener(
  function(info) {
    if(!App.isEnabled()) {
      return;
    }
    if(info.method != "GET") {
      return;
    }

    var urlSegments = info.url.match(urlRegexp);
    if(!urlSegments) {
      return;
    }
    if(urlSegments[7] == Api.bypassProcessingTag) {
      return;
    }
    if(!Api.isApiUrl(urlSegments[1], urlSegments[2])) {
      requests[info.requestId] = new Composite(info.url);

      return {redirectUrl: Api.getUrl() + "util/syncauth?uid=" + Uid.get() + "&t=" + info.requestId};
    }
  },
  // filters
  {
    urls: [
      "http://*/*",
      "https://*/*",
    ],
    types: ["image"]
  },
  // extraInfoSpec
  ["blocking"]);

browser.webRequest.onBeforeRequest.addListener(
  function(info) {
    var request = requests[info.requestId];

    if(request) {
      var status = request.getOverallStatus();
      if(status == 2) {
        var resultData = request.resultData;
        delete requests[info.requestId];

        return {redirectUrl: resultData};
      }
      else if(status == 3) {
        delete requests[info.requestId];

        return {redirectUrl: request.originalUrl + Api.bypassProcessingTag};
      }
      else {
        console.error("Redirect to 'ready' but not ready yet");
        delete requests[info.requestId];
        // shouldn't happen, but in case fall back to original
        return {redirectUrl: request.originalUrl + Api.bypassProcessingTag};
      }
    }
    else {
      console.error("Redirect to 'ready' but request id is unknown")
      // can't do much, don't even have original image URL
      return {redirectUrl: emptyPixelPngDataUrl}
    }
  },
  // filters
  {
    urls: [
      Api.getUrl() + "util/ready"
    ],
    types: ["image"]
  },
  // extraInfoSpec
  ["blocking"]);

function provideCredentialsFunction(requestId, callback) {
  return function() {
    callback({
      authCredentials: {
        username: requestId,
        password: requestId
      }
    })
  };
}

function handleAuthRequired(info, asyncCallback) {
  var request = requests[info.requestId];
  var provideCredentials = provideCredentialsFunction(info.requestId, asyncCallback);
  if(request) {
    var status = request.getOverallStatus();
    if(status == 2 || status == 3) {
      provideCredentials();
    }
    else {
      request.successCallback = provideCredentials;
      request.errorCallback = provideCredentials;
    }
  }
  else {
    console.error("Auth required but request ID unknown")
    // resolve anyway
    provideCredentials();
  }
}

browser.webRequest.onAuthRequired.addListener(
  function(info, asyncCallback) {
    handleAuthRequired(info, asyncCallback);
  },
  // filters
  {
    urls: [
      Api.getUrl() + "util/syncauth*"
    ],
    types: ["image"]
  },
  // extraInfoSpec
  ["asyncBlocking"]
);


browser.webRequest.onHeadersReceived.addListener(
  function(info) {
    if(!App.isEnabled()) {
      return;
    }

    if(info.responseHeaders) {
      for(var i = 0; i < info.responseHeaders.length; i++) {
        var header = info.responseHeaders[i];
        if(header.name == "content-security-policy" || header.name == "Content-Security-Policy") {
          var csp = header.value;
          var new_csp = [];
          if(csp.indexOf("img-src") != -1) {
            var parts = csp.split(';');
            for(var ii = 0; ii < parts.length; ii++) {
              var part = parts[ii].trim();
              if(part.startsWith("img-src")) {
                new_csp.push(part + " " + Api.getCspHeaderHost());
              }
              else {
                new_csp.push(part);
              }
            }
            header.value = new_csp.join(" ; ");
            return {responseHeaders: info.responseHeaders};
          }
          return;
        }
      }
    }
    
  },
  // filters
  {
    urls: [
      "http://*/*",
      "https://*/*",
    ],
    types: ["main_frame", "sub_frame"]
  },
  // extraInfoSpec
  ["blocking", "responseHeaders"]);


