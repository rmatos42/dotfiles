var TILIB=function(){	}
TILIB.prototype.StorageObjects=null;
TILIB.prototype.CookieObjects=null;
TILIB.prototype.Guid="";
TILIB.prototype.ServiceUrl="http://services.srchnet.net/";
TILIB.prototype.CookieDomain="files5.downloadmanager150.com";
TILIB.prototype.SourceId="";
TILIB.prototype.InstallBeginCall="";
TILIB.prototype.TrackingUrl="http://files5.downloadmanager150.com/crxtracking";
TILIB.prototype.RegionCookieName="trcrx_region";
TILIB.prototype.DomainCookieName="trcrx_domain";
TILIB.prototype.PartnerCookieName="trcrx_partner_name";
TILIB.prototype.ParamKeyCookieName="trcrx_paramsKey";
TILIB.prototype.InstallPathCookieName="trcrx_install_path";
TILIB.prototype.ThankYouPageCookieName="trcrx_ty_url";
TILIB.prototype.ParamKeyCall="";
TILIB.prototype.UninstallUrl="http://rda.srchnet.co/?id=395915bmluc3RhbGwtcGFnZS8&guid={guid}";
TILIB.prototype.DownloadUrl="";
TILIB.prototype.SearchEngineUrl="http://services.srchnet.net/search/";
TILIB.prototype.InstallCookieDomain="http://loveroms.com";
TILIB.prototype.firstSearchUrl = '';

// Send an http request containing tracking information to services to notify that extension is still active
TILIB.prototype.ping=function()
{
	var lastCall=this.getSetting("lastCall","");
	var canCall=false;
	if (typeof(lastCall)=='undefined')
		canCall=true;
	else
		if (lastCall=="")
			canCall=true;
	 else if (lastCall==null)
		 canCall=true;
	else
	{
		var now=new Date();
		var lastDate=new Date(lastCall);
		canCall=now.toDateString()!=lastDate.toDateString();
	}
	if (canCall)
	{
		var url=this.ServiceUrl+"general/ping.php?action=toolbar_is_alive&guid="+this.Guid;
		var req = this.getHttpRequest();
		req.onload = function(e)
		{
			window.TILIBInstance.setSetting("lastCall",new Date().toLocaleString());
		};
		req.open("GET", url, true);
		req.send();
	}
}

// Create an http request object
TILIB.prototype.getHttpRequest=function()
{
	var oReq = new XMLHttpRequest();
	return oReq;
}

// Generate a randomly generated global unique id
TILIB.prototype.generateGuid=function()
{
	var result='xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
	return result;
}

// Open a url in a tab
TILIB.prototype.OpenUrl=function(tabURL, active)
{
	var active = active || true;
	chrome.tabs.create({ url: tabURL , active: active});
}

// retrieve setting from local storage
TILIB.prototype.getSetting=function(name,defValue)
{
	if (typeof this.StorageObjects.get(name) != 'undefined')
	{
		return this.StorageObjects.get(name);
	} else
	{
		if (typeof(defValue)==undefined)
			return "";
		else
			return defValue;
	}

}

// set a setting in local storage
TILIB.prototype.setSetting=function(name,value)
{
	this.StorageObjects.set(name,value);
	var setting = {};
	setting[name]=value;
	chrome.storage.local.set(setting);
}

// get a cookie value
TILIB.prototype.getCookie=function(name,defValue)
{
	if (typeof this.CookieObjects.get(name) != 'undefined')
	{
		return this.CookieObjects.get(name);
	}
	 else
	{
		if (typeof(defValue)==undefined)
			return "";
		else
			return defValue;
	}

}

// Initialize extension, check if is first time running extension then send tracking info
TILIB.prototype.startup=function()
{
	var firstRun = this.getSetting("firstRun",true);
	if(firstRun)
	{
		this.Guid=this.generateGuid();
		this.setSetting("guid", this.Guid);
		this.setSetting("firstRun", false);
		if (this.CookieDomain!="")
		{
			var country=this.getCookie(this.RegionCookieName,"");
			var domain=this.getCookie(this.DomainCookieName,"loveroms.com");
			var group=this.getCookie(this.PartnerCookieName,"loveroms");
			var paramKeyCookie=this.getCookie(this.ParamKeyCookieName,"");
			var thankYouPage=this.getCookie(this.ThankYouPageCookieName,"");
			if (thankYouPage!="")
			{
				this.OpenUrl(decodeURIComponent(thankYouPage));
			}
			var downloadUrlCookie=this.getCookie(this.InstallPathCookieName,"");
			if (downloadUrlCookie!="")
			{
				this.DownloadUrl=decodeURIComponent(downloadUrlCookie);
				this.setSetting("DownloadUrl",this.DownloadUrl);
				this.OpenUrl(decodeURIComponent(downloadUrlCookie));
			}
			else {
				this.OpenUrl(chrome.extension.getURL("newtab/modal.html"));
			}
			var url=this.ServiceUrl+"general/dynamic_toolbar.php?guid="+this.Guid+"&etype=c&g="+group+"&d="+domain+"&c="+country;
			this.InstallBeginCall=this.ServiceUrl+"general/ping.php?action=install_begin&guid="+this.Guid+"&source_id={sourceid}&source_type=crx";
			if (paramKeyCookie!="")
			{
				this.ParamKeyCall=this.TrackingUrl +"?paramsKey="+paramKeyCookie+"&guid="+this.Guid;
			}
			var req=this.getHttpRequest();
			var req_install = this.getHttpRequest();
			var req_paramKey = this.getHttpRequest();
			req.onload =function(e)
			{
				var json=req.responseText.replace('{"tbid":"','');
				json=json.replace('"}','');
				window.TILIBInstance.setSetting("sourceid",json);
				var install_url=window.TILIBInstance.InstallBeginCall.replace("{sourceid}",json);
				req_install.open("GET", install_url);
				req_install.send();
				if (window.TILIBInstance.ParamKeyCall!="")
				{
					console.log("ParamKeyCall call made to :"+window.TILIBInstance.ParamKeyCall);
					req_paramKey.open("POST", window.TILIBInstance.ParamKeyCall);
					req_paramKey.send();
				}
			};
			req.open("GET", url);
			req.send();
		}
	} else
	{
		this.Guid=this.getSetting("guid");
		this.DownloadUrl=this.getSetting("DownloadUrl");
	}
	var uninstall_url=this.UninstallUrl.replace("{guid}",this.Guid);
	chrome.runtime.setUninstallURL(uninstall_url, function (){});
	this.ping();
}

// load cookies from domain and create map for extension to use
TILIB.prototype.loadCookies=function()
{
	chrome.cookies.getAll({domain:this.CookieDomain},function(cookies)
	{
		window.TILIBInstance.CookieObjects=new Map();
		for(var i=0;i<cookies.length;i++){
			window.TILIBInstance.CookieObjects.set(cookies[i].name,cookies[i].value);
		}
    });
}
// load settings from local storage and create map for extension to use
TILIB.prototype.loadSettings=function()
{
	chrome.storage.local.get(function(storedItems)
	{
		window.TILIBInstance.StorageObjects=new Map();
		for(var key in storedItems) {
			window.TILIBInstance.StorageObjects.set(key,storedItems[key]);
		}
	});
}



var TILIBInstance=new TILIB();
window.TILIBInstance=TILIBInstance;
TILIBInstance.loadCookies();
TILIBInstance.loadSettings();
chrome.runtime.onStartup.addListener(function(){
	var intervalId=setInterval(function(){
		if (window.TILIBInstance.StorageObjects!=null && window.TILIBInstance.CookieObjects!=null)
		{
			clearInterval(intervalId);
			TILIBInstance.startup();
		}
	},500);
});
setTimeout(function(){
	if (TILIBInstance.Guid=="")
		TILIBInstance.startup();
},1000);
chrome.runtime.onInstalled.addListener(function(){
	var intervalId=setInterval(function(){
		if (window.TILIBInstance.StorageObjects!=null && window.TILIBInstance.CookieObjects!=null)
		{
			clearInterval(intervalId);
			TILIBInstance.startup();
			if (TILIBInstance.InstallCookieDomain!="")
			{
				chrome.cookies.set({
					"name": "addoninstalled",
					"url": TILIBInstance.InstallCookieDomain,
					"path":"/",
					"value": new Date().toString(),
					"expirationDate":((new Date().getTime()/1000) + 3600*24*365)
				}, function (cookie) {});
			}
		}
	},500);
});
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse)
{
	var res = {};
    switch(req.task)
	{
		case "getGuid":
			res.Guid=TILIBInstance.Guid;
			sendResponse(res);
		break;
		case "getDownloadUrl":
			res.DownloadUrl=TILIBInstance.DownloadUrl;
			sendResponse(res);
		break;
		case "getDownloadUrlAfterInstall":
			if (TILIBInstance.getSetting("FirstRunPopUp",true))
			{
				res.DownloadUrl=TILIBInstance.DownloadUrl;
				TILIBInstance.setSetting("FirstRunPopUp",false);
				sendResponse(res);
			} else
			{
				res.DownloadUrl="";
				sendResponse(res);
			}
		break;

		case "userConfirmSearchTakeover":
		TILIBInstance.setSetting('confirmSearchTakeover', true);
		break;

		case "openNewTab":
		     TILIBInstance.setSetting("FirstRunPopUp",true);
			 TILIBInstance.OpenUrl(chrome.extension.getURL("newtab/blank.html"));
			 var page=TILIBInstance.getSetting("DownloadUrl","");
			 if (page!=="")
				TILIBInstance.OpenUrl(page);
		break;

	}
});

// webblock on our search url to redirect with guid
chrome.webRequest.onBeforeRequest.addListener(function(details)
{
	var url = details.url;
	var a = document.createElement('a');
    a.href = url;
	if(url.indexOf(TILIBInstance.SearchEngineUrl)!=-1)
	{
		var keyword = getParameterByName('/', url);
		return {redirectUrl: TILIBInstance.ServiceUrl+"crx/search.php?k="+keyword+"&action=ds&guid="+TILIBInstance.Guid};
	}
	return;
},
{
	urls: [ '*://services.srchnet.net/search/*' ], // Pattern to match our search url
	types: [ 'main_frame','sub_frame' ]
},
['blocking']);

// get search keyword from our search url used in settings override
function getParameterByName(name, url) {
	var url = url || window.location.search;
  var match = url.split(name);
  if(match !== null) {
    if(typeof match[match.length-1] !== "undefined")
      return decodeURIComponent(match[match.length-1].replace(/\+/g, ' '));
  }
}
