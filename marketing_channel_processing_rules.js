export function createMarketingRules(dataElements) {
  const marketingRules = {
	_satellite: dataElements,
	isPaidSearch: function (url, referrer) {
	/* Rule 1: Paid Search
		IF [ANY] are true:
			  * [MATCHES] Paid Search Detection Rules ie querystring contains `cid=ps` || `s_kwcid=AL!` || `s_kwcid`
			  * -AMO-ID-[STARTS-WITH]-"AL!"- // NOT POSSIBLE
			  * Query String Parameter `s_kwcid` [STARTS WITH] `AL!`
			  * Page URL [CONTAINS] `&ps%3` || `?ps%3` || `&ps:` || `?ps:`
			  * Query String Parameter `gclid` [EXISTS]
		THEN
			  * Channel = "Paid Search"
			  * Channel Detail = "Page Grouping (eVar26)"
		*/
		/* NOTE: there is some silly double up in this code, but only because I'm
				 trying to faithfully match the Marketing Channel Processing Rules
		*/
	  var retVal = false,
		channel = "Paid Search",
		channel_detail = "Page Grouping (eVar26)",
		isFromSearchEngine = this.isNaturalSearch(referrer),
		url_query = new URLSearchParams(url.search);
	  if (isFromSearchEngine) {
		if (/cid=ps|s_kwcid=AL!|s_kwcid=AL!/i.test(url.search)) {
		  retVal = true;
		} else if ((url_query.get("cid") || "").startsWith("AL!")) {
		  retVal = true;
		} else if (/&ps%3|\?ps%3|&ps:|\?ps:/i.test(url.href)) {
		  retVal = true;
		} else if (url_query.get("gclid")) {
		  retVal = true;
		}
	  }
	  return retVal ? { channel, channel_detail } : false;
	},
	// Rule 2: Natural Search
	isNaturalSearch: function (referrer) {
	/* Rule 2: Natural Search
		IF [ALL] are true:
			  * [MATCHES] Natural Search Detection Rules [https://experienceleague.adobe.com/en/docs/analytics/components/dimensions/search-engine]
		THEN
			  * Channel = "Natural Search"
			  * Channel Detail = "Search Engine + Search Keyword(s)" NOTE: This doesn't work any more for a looong time.
		 */
	  var retVal = false,
		referrer_hostname = referrer instanceof URL ? referrer.hostname : "",
		channel = "Natural Search",
		channel_detail = "Search Keyword(s)";
	  if (!referrer_hostname) {
		return false;
	  }
	  var searchEngineDomains = ["adsensecustomsearchads.com", "aol.co.uk", "aol.com",
			"baidu.com", "bing.com", "brave.com", "coccoc.com",
			"dogpile.com", "duckduckgo.com", "ecosia.org",
			"com.google", "google.ae", "google.al", "google.am", "google.as", "google.at",
			"google.az", "google.ba", "google.be", "google.bg", "google.bi", "google.by",
			"google.ca", "google.ch", "google.cl", "google.cm", "google.co.bw", "google.co.cr",
			"google.co.id", "google.co.il", "google.co.in",	"google.co.jp", "google.co.ke",
			"google.co.kr", "google.co.ls", "google.co.ma", "google.co.nz",	"google.co.th",
			"google.co.ug", "google.co.uk", "google.co.uz", "google.co.ve", "google.co.za",
			"google.co.zm", "google.com.ag", "google.com.ai", "google.com.ar", "google.com.au",
			"google.com.bd", "google.com.bh", "google.com.br", "google.com.co", "google.com.cu",
			"google.com.cy", "google.com.ec", "google.com.eg", "google.com.fj", "google.com.hk",
			"google.com.jm", "google.com.kh", "google.com.kw", "google.com.lb", "google.com.mm",
			"google.com.mt", "google.com.mx", "google.com.my", "google.com.ng", "google.com.np",
			"google.com.pa", "google.com.pe", "google.com.pg", "google.com.ph", "google.com.pk",
			"google.com.py", "google.com.qa", "google.com.sa", "google.com.sg", "google.com.tr",
			"google.com.tw", "google.com.ua", "google.com.uy", "google.com.vc", "google.com.vn",
			"google.com", "google.cz", "google.de", "google.dk", "google.dz", "google.ee",
			"google.es", "google.fi", "google.fm", "google.fr", "google.gg", "google.gr",
			"google.gy", "google.hr", "google.hu", "google.ie", "google.iq", "google.is",
			"google.it", "google.je", "google.jo", "google.kg", "google.kz", "google.lk",
			"google.lt", "google.lu", "google.lv", "google.mn", "google.mu", "google.nl",
			"google.no", "google.pl", "google.pt", "google.ro", "google.rs", "google.ru",
			"google.rw", "google.sc", "google.se", "google.sh", "google.si", "google.sk",
			"google.tn", "google.vg", "google.ws", "googleadservices.com",
			"naver.com", "petalsearch.com", "presearch.com",
			"qwant.com", "so.com", "startpage.com", "syndicatedsearch.goog",
			"ya.ru","yahoo.co.jp", "yahoo.com", "yandex.com.tr", "yandex.com",
			"yandex.kz", "yandex.ru",
	  ];
	  for (var i = 0; i < searchEngineDomains.length; i++) {
		if (referrer_hostname.endsWith(searchEngineDomains[i])) {
		  retVal = true;
		  break;
		}
	  }
	  return retVal ? { channel, channel_detail } : false;
	},
	// Rule 3 & 4: Email
	  // @param {url} url - The URL object to check.
	isEmail: function (url) {
		var url_query = new URLSearchParams(url.search);
		var retVal = false,
			channel = "Email",
			channel_detail,
			eVar0 = this._satellite.getVar("cid") || "",
			query_cid = url_query.get("cid") || "",
			query_serviceId = url_query.get("serviceid") || "";
		/* Rule 3: Email
		IF [ANY] are true:
			* Query String Parameter `cid` [STARTS WITH] `em`
			* CID Reports (eVar0) [CONTAINS] `em`
		THEN
			* Channel = "Email"
			* Channel Detail = "CID Reports (eVar0)"
		*/
		if (query_cid.startsWith("em") || eVar0.includes("em")) {
			channel_detail = eVar0;
			retVal = true;
		} 
		/* Rule 4: Email
		IF [ALL] are true:
			* Query String Parameter `serviceid` [STARTS WITH] `em`
		THEN
			* Channel = "Email"
			* Channel Detail = "Query String Parmeter `serviceid`"
		*/
		else if (query_serviceId.startsWith("em")) {
			channel_detail = query_serviceId;
			retVal = true;
		}
	  return retVal ? { channel, channel_detail } : false;
	},
	// Rule 5: Offline (Vanity url)
	// @param {url} url - The URL object to check.
	isOfflineVanityUrl: function (url) {
	  	var eVar0 = this._satellite.getVar("cid") || "";
		/* Rule 5: Offline (Vanity url)
		IF [ANY] are true:
			* CID Reports (eVar0) [STARTS WITH] `vt` || `qr` || `dm`
		THEN
			* Channel = "Offline (Vanity url)"
			* Channel Detail = "CID Reports (eVar0)"
		*/
	  var channel = "Offline (Vanity url)",
		channel_detail = eVar0;
		if (
			eVar0.startsWith("vt:") ||
			eVar0.startsWith("qr:") ||
			eVar0.startsWith("dm")
		) {
			return { channel, channel_detail };
		} else {
			return false;
		}
	},
	// Rule 6: SMS / Push
	isSMSorPushNotification: function () {
		/* Rule 6: SMS / Push
		IF [ANY] are true:
			* CID Reports (eVar0) [STARTS WITH] `sms:`
			* CID Reports (eVar0) [STARTS WITH] `push:`
		THEN
			* Channel = "SMS / Push"
			* Channel Detail = "CID Reports (eVar0)"
		*/
		var retVal = false,
			channel = "SMS / Push",
			eVar0 = this._satellite.getVar("cid") || "";
		if (eVar0.startsWith("sms:") || eVar0.startsWith("push:")) {
			retVal = true;
		}
		return retVal ? { channel, channel_detail: eVar0 } : false;
	},
	// Rule 7: Display ClickThrough
	isDisplayClickThrough: function (url) {
		/* Rule 7: Display ClickThrough
		IF [ANY] are true:
			* Query String Parameter `cid` [STARTS WITH] `di`
			* CID Reports (eVar0) [STARTS WITH] `di:`
			* Clean URL (eVar33) [ENDS WITH] `:d`
			* Query String Parameter `ef_id` [ENDS WITH] `:d`
		THEN
			* Channel = "Display ClickThrough"
			* Channel Detail = "Query String Parameter `cid`"
		*/
		var url_query = new URLSearchParams(url.search);
		var retVal = false,
			channel = "Display ClickThrough",
			channel_detail = url_query.get("cid"),
			eVar0 = this._satellite.getVar("cid") || "",
			eVar33 = this._satellite.getVar("clean_url") || "",
			query_cid = url_query.get("cid") || "",
			query_ef_id = url_query.get("ef_id") || "";
		/*
		console.log("[isDisplayClickThrough]", {
			channel,channel_detail,eVar0,eVar33,query_cid
		});
		*/
		if( /^di/i.test(query_cid)   ||  // ?cid starts with `di`
			/^di:/i.test(eVar0)      ||  // cid reports starts with `di:`
			/:d$/i.test(eVar33)      ||  // clean_url ends with `:d`
			/:d$/i.test(query_ef_id)     // ?ef_id ends with `:d`
		){
			retVal = true
		}
		return retVal ?  {channel, channel_detail: query_cid} : false
	},

	// Rule 8: Social Networks
	isSocialNetworks: function (url, referrer) {
		/* Rule 8: Social Networks
		IF [ANY] are true:
			* Referring Root Domain [EQUALS] instagram.com || facebook.com || linkedin.com || twitter.com || plus.google.com || orkut.com || friendster.com || livejournal.com || blogspot.com || wordpress.com || friendfeed.com || myspace.com || digg.com || reddit.com || stumbleupon.com || twine.com || yelp.com || mixx.com || delicious.com || tumblr.com || disqus.com || intensedebate.com || plurk.com || slideshare.net || backtype.com || netvibes.com || mister-wong.com || diigo.com || flixster.com || youtube.com || vimeo.com || 12seconds.tv || zooomr.com || identi.ca || jaiku.com || flickr.com || imeem.com || dailymotion.com || photobucket.com || fotolog.com || smugmug.com || classmates.com || myyearbook.com || mylife.com || tagged.com || brightkite.com || ning.com || bebo.com || hi5.com || yuku.com || cafemom.com || xanga.com
			* CID Reports (eVar0) [STARTS WITH] `sc:`

		THEN
			* Channel = "Social Networks"
			* Channel Detail = "Referring Domain"
		*/
		var retVal = false,
			referrer_hostname = referrer instanceof URL ? referrer.hostname : "",
			channel = "Social Networks",
			eVar0 = this._satellite.getVar("cid") || "";
		/*
		console.log("[isSocialNetworks]", {
			url, referrer, referrer_hostname, eVar0
		});
		*/
		const socialNetworks = [
			'instagram.com', 'facebook.com', 'linkedin.com', 'twitter.com', 'plus.google.com',
			'orkut.com', 'friendster.com', 'livejournal.com', 'blogspot.com', 'wordpress.com',
			'friendfeed.com', 'myspace.com', 'digg.com', 'reddit.com', 'stumbleupon.com',
			'twine.com', 'yelp.com', 'mixx.com', 'delicious.com', 'tumblr.com', 'disqus.com',
			'intensedebate.com', 'plurk.com', 'slideshare.net', 'backtype.com', 'netvibes.com',
			'mister-wong.com', 'diigo.com', 'flixster.com', 'youtube.com', 'vimeo.com',
			'12seconds.tv', 'zooomr.com', 'identi.ca', 'jaiku.com', 'flickr.com', 'imeem.com',
			'dailymotion.com', 'photobucket.com', 'fotolog.com', 'smugmug.com', 'classmates.com', 'myyearbook.com', 'mylife.com', 'tagged.com', 'brightkite.com', 'ning.com',
			'bebo.com', 'hi5.com', 'yuku.com', 'cafemom.com', 'xanga.com'
			];
		
		// The logic checks if the hostname ends with any of the domains in the list
        for (var i = 0; i < socialNetworks.length; i++) {
            if (referrer_hostname.endsWith(socialNetworks[i])) {
                retVal = true;
            }
        }
		if(eVar0.startsWith('sc:')) {
			retVal = true;
		}
		return retVal ? {channel, channel_detail:referrer_hostname} : false
	},

	// Rule 9: Third Party
	isThirdParty: function(){
		/* Rule 9: Third Party
		IF [ALL] are true:
			* CID Reports (eVar0) [STARTS WITH] `tp:`
		THEN
			* Channel = "Third Party"
			* Channel Detail = "CID Reports (eVar0)"
		*/
		var eVar0 = this._satellite.getVar('cid') || "";
		var channel = "Third Party",
			channel_detail = eVar0;
		if (eVar0.startsWith('tp:')) {
			return {channel, channel_detail};
		}else{
			return false;
		}
	},

	// Rule 10: Universal Links
	isUniversalLink: function(){
		/* Rule 10: Universal Links
		IF [ALL] are true:
			* CID Reports (eVar0) [STARTS WITH] `ul:`
		THEN
			* Channel = "Universal Links"
			* Channel Detail = "CID Reports (eVar0)"
		*/
		var eVar0 = this._satellite.getVar('cid') || "";
		var channel = "Universal Links",
			channel_detail = eVar0;
		if (eVar0.startsWith('ul:')) {
			return {channel, channel_detail};
		}else{
			return false;
		}
	},

	// Rule 11 Magic Links
	isMagicLink: function(){
		/* Rule 11 Magic Links
		IF [ALL] are true:
			* CID Reports (eVar0) [STARTS WITH] `ml:`
		THEN
			* Channel = "Magic Links"
			* Channel Detail = "CID Reports (eVar0)"
		*/
		var eVar0 = this._satellite.getVar('cid') || "";
		var channel = "Magic Links",
			channel_detail = eVar0;
		if (eVar0.startsWith('ml:')) {
			return {channel, channel_detail};
		}else{
			return false;
		}
	},

	// Rule 12 & 13 Referring Domains
	/* TODO: Define Referring Domain and First Hit of Visit */
	isReferringDomains: function(referrer, isFirstHitOfVisit){
		/* Rule 12 Referring Domains
		IF [ALL] are true:
			* Referring Domain [IS NOT EMPTY]
			* Is First Hit of Visit
		THEN
			* Channel = "Referring Domains"
			* Channel Detail = "Referring Domain"
		*/
		var retVal = false,
			referrer_hostname = (referrer instanceof URL) ? referrer.hostname : "",
			sessionPageViews = this._satellite.getVar('page_views_session'),
			isFirstHitOfVisit = this._satellite.getVar('page_views_session') === "1" ? true : false,
			eVar0 = this._satellite.getVar('cid') || "",
			channel = "Referring Domains";
		console.log("[isReferringDomains()]", {isFirstHitOfVisit, sessionPageViews});
		if (referrer_hostname && isFirstHitOfVisit) {
			retVal = true;
		}
		/* Rule 13 Referring Domains
		IF [ALL] are true:
			* CID Reports (eVar0) [STARTS WITH] `rd:`
		THEN
			* Channel = "Referring Domains"
			* Channel Detail = "Referring Domain"
		*/
		else if (eVar0.startsWith('rd:')) {
			retVal = true;
		}
		return retVal ? {channel,channel_detail:referrer_hostname} : false
	},

	/* Rule 14 Display ViewThrough */
	isDisplayViewThrough: function(url, referrer){
		/* Rule 14 Display ViewThrough
		IF [ANY] are true:
			* Clean URL (eVar33) [ENDS WITH] `:i`
			* AMO ID [STARTS WITH] "AC!"
		THEN
			* Channel = "Display ViewThrough"
			* Channel Detail = "Referring Domain"
		--
		NOTE: AMO ID is where s_kwcid starts with "AC!"
		*/
		var retVal = false,
			url_query = new URLSearchParams(url.search),
			cleanURL = this._satellite.getVar('clean_url') || "",
			channel = "Display ViewThrough",
			referrer_hostname = (referrer instanceof URL) ? referrer.hostname : "";
		var s_kwcid = url_query.get('s_kwcid') || "";
		if (cleanURL.endsWith(':i') || s_kwcid.startsWith('AC!')) {
			retVal = {channel,channel_detail:referrer_hostname}
		}
		return retVal
	},

	/* Rule 15 Display (View and Click) */
	/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	NOTE: THIS RULE WOULD NEVER BE TRIGGERED
	BECAUSE 14 WOULD CATCH IT FIRST
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	*/
	isDisplayViewAndClick: function(url){
		/* Rule 15 Display (View and Click)
		IF [ALL] are true:
			* AMO ID [STARTS WITH] "AC!"
		THEN
			* Channel = "Display (View and Click)"
			* Channel Detail = "Query String Parmeter `cid`"
		--
		NOTE: AMO ID is where s_kwcid starts with "AL!"
		*/
		var retVal = false,
			url_query = new URLSearchParams(url.search),
			cleanURL = this._satellite.getVar('clean_url') || "",
			channel = "Display (View and Click)",
			referrer_hostname = (referrer instanceof URL) ? referrer.hostname : "";
		var s_kwcid = url_query.get('s_kwcid') || "",
			eVar0 = url_query.get('cid');
		if (s_kwcid.startsWith('AC!')) {
			retVal = {channel,channel_detail:eVar0}
		}
		return retVal
	}
  }
  return marketingRules;
}
