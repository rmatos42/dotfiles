var adflyLink, lnk;
var g_cnt = 0;
var scriptContent = document.getElementsByTagName('head')[0].innerHTML;

lnk = scriptContent.match(/ysmm[^;]+;/g);
if(lnk.length){
	lnk = lnk[0].replace(/(^[^'"]+['"])([^'"]+)(['"]\;$)/, "$2");
	
	var p1 = '', p2 = '';
	for(var z = 0; z <= lnk.length; z++){
		if(z%2 == 0)
			p1 += lnk.charAt(z);
		else
			p2 = lnk.charAt(z) + p2;
	}
	p1 = atob(p1);
	adflyLink = p1.substr(2) + atob(p2);
}


function byPass_adfly__chg_iFrame(c){
	if(c > 30 || adflyLink == '')
		return;
	
	if( typeof(document.getElementById('rf')) == 'undefined'){
		window.setTimeout(function(){ byPass_adfly__chg_iFrame(++c); }, 100);
	}else{
		window.setTimeout(function(){ byPass_adfly__insert_IFrame(); }, 1);
	}
}

function byPass_adfly__insert_IFrame(){
	var rootObj = document.getElementById('rf').parentNode;
	rootObj.style.position = 'relative';
	var destIF = document.createElement("iframe");
	destIF.frameBorder = '0';
	destIF.style.width = '100%';
	destIF.style.height = '100%';
	destIF.style.backgroundColor = 'white';
	destIF.style.position = 'absolute';
	destIF.style.top = '0px';
	destIF.style.left = '0px';
	destIF.style.zIndex = 32000;
	destIF.src = adflyLink;
	rootObj.appendChild(destIF);
}

byPass_adfly__chg_iFrame(1);
