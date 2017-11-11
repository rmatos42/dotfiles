window.addEventListener("openNewTab", function() {
  chrome.runtime.sendMessage({task:"openNewTab"}, function(res){});
});
