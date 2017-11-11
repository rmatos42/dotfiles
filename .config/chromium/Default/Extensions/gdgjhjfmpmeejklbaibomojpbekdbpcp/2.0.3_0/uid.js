var Uid = new (function() {
  var generateUid = function(length) {
    var uid = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < length; i++) {
      uid += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return uid;
  }

  this.get = function() {
    if(localStorage.uid == undefined) {
      localStorage.uid = generateUid(32);
    }
    return localStorage.uid
  }
});


