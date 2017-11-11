var Api = new (function() {
  var generateRandomToken = function(length) {
    var token = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < length; i++) {
      token += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return token;
  }

  this.bypassProcessingTag = "#kaleido-request-" + generateRandomToken(32);

  var scheme = "https:";
  var hostname = (
    "api.kaleido.ai"
  );
  var portSuffix = (
    ""
  );
  var path = "/v1.0/";

  var host = hostname + portSuffix;

  var token = "j32FCzjQKkgbGD4rMwd2Rz9i";

  this.getUrl = function() {
    return scheme + "//" + host + path;
  }

  this.isApiUrl = function(givenScheme, givenHost) {
    return givenScheme == scheme && givenHost == host;
  }

  this.getCspHeaderHost = function() {
    return scheme + "//" + host;
  }

  this.getToken = function() {
    return token;
  }
});


