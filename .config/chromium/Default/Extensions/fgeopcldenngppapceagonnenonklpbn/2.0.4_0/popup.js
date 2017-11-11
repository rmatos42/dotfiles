function click(e) {

  if(e.target.id=="Password"){passwordOff('password','text')}
  else if(e.target.id=="Hidden"){passwordOff('hidden','text')}
  else if(e.target.id=="Twitter"){hideTwitter()}
  window.close();
}

function passwordOff(turn,into) {
  chrome.tabs.executeScript(null,
      {code:"var inputs = document.getElementsByTagName('input');for(var i = 0; i < inputs.length; i++) {if(inputs[i].type.toLowerCase() == '" + turn + "') {inputs[i].type = '" + into + "';}}"},null);
  window.close();
}
function hideTwitter() {
  chrome.tabs.executeScript(null,
      {code:"if(document.getElementById('page-container').style.display=='none') document.getElementById('page-container').style.display = 'block'; else document.getElementById('page-container').style.display = 'none';"});
  window.close();
}
document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});