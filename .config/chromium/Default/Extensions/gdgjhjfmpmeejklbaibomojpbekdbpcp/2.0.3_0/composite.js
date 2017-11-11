var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d');

var Composite = function(originalUrl){
  this.originalUrl = originalUrl;

  // 0 = queued
  // 1 = sent
  // 2 = received
  // 3 = error
  this.originalStatus = 0;
  this.originalImage = null;

  // 0 = queued
  // 1 = sent
  // 2 = received
  // 3 = error
  this.overlayStatus = 0;
  this.overlayImage = null;

  this.resultData = null;
  this.callbackInvoked = false;
  this.successCallback = null;
  this.errorCallback = null;

  this.fetchOriginal();
  this.fetchOverlay();
}

Composite.prototype.fetchOriginal = function() {
  var img = new Image();

  this.originalImage = img;
  this.originalStatus = 1;

  var self = this;

  img.onload = function (event) {
    self.originalStatus = 2;
    self.onStatusChange();
  }
  img.onerror = function (event) {
    self.originalStatus = 3;
    self.onStatusChange();
  }

  img.crossOrigin = "Anonymous";
  img.src = this.originalUrl + Api.bypassProcessingTag;
}


Composite.prototype.fetchOverlay = function() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET",
    Api.getUrl() + "addbeards?uid=" + Uid.get() + "&url=" + encodeURIComponent(this.originalUrl) + Api.bypassProcessingTag
  );
  xhr.setRequestHeader("Authorization", "Token " + Api.getToken());

  var self = this;

  xhr.addEventListener('load', function(event) {
    if(xhr.status >= 200 && xhr.status <= 299 && xhr.getResponseHeader("X-Composite-Mode") == "overlay") {
      var blob = new Blob([xhr.responseText], {type : 'image/svg+xml'}); 
      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          self.overlayImage = img;

          self.overlayStatus = 2;
          self.onStatusChange();
        };
        img.onerror = function() {
          self.overlayStatus = 3;
          self.onStatusChange();
        }
        img.src = e.target.result;
      };
      reader.onerror = function() {
        self.overlayStatus = 3;
        self.onStatusChange();
      }
      reader.readAsDataURL(blob);
    }
    else {
      if(xhr.status == 429) {
        var retryIn = xhr.getResponseHeader("X-Ratelimit-Reset");
        disableDueToRateLimit(retryIn);
      }

      self.overlayStatus = 3;
      self.onStatusChange();
    }
  });
  xhr.addEventListener("error", function(event) {
    self.overlayStatus = 3;
    self.onStatusChange();
  });

  this.overlayStatus = 1;
  xhr.send();
}

Composite.prototype.onStatusChange = function() {
  var status = this.getOverallStatus();
  if(status == 2 && this.resultData == null) {
    this.compositeResultData();
  }

  if(status == 2 && this.successCallback != null && !this.callbackInvoked) {
    this.callbackInvoked = true;
    this.successCallback();
  }
  else if(status == 3 && this.errorCallback != null && !this.callbackInvoked) {
    this.callbackInvoked = true;
    this.errorCallback();
  }
}

Composite.prototype.getOverallStatus = function() {
  if(this.originalStatus == 2 && this.overlayStatus == 2) {
    return 2;
  }
  else if(this.originalStatus == 3 || this.overlayStatus == 3) {
    return 3;
  }
  else if(this.originalStatus == 1 || this.overlayStatus == 1) {
    return 1;
  }
  else {
    return 0;
  }
}

Composite.prototype.compositeResultData = function() {
  var originalImage = this.originalImage;
  var originalWidth = originalImage.naturalWidth;
  var originalHeight = originalImage.naturalHeight;

  var overlayImage = this.overlayImage;
  var overlayWidth = overlayImage.naturalWidth;
  var overlayHeight = overlayImage.naturalHeight;

  canvas.width = originalWidth;
  canvas.height = originalHeight;

  context.drawImage(originalImage, 0, 0, originalWidth, originalHeight);
  context.drawImage(overlayImage, 0, 0, overlayWidth, overlayHeight);

  var dataUrl = canvas.toDataURL(
    'image/webp', 90
  );

  this.resultData = dataUrl;

  context.clearRect(0, 0, originalWidth, originalHeight);
}
