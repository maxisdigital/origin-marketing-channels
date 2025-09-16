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
		var retVal,
			channel = "Paid Search",
			isFromSearchEngine = this.isNaturalSearch(referrer),
			referrer_hostname = (referrer instanceof URL) ? referrer.hostname : "",
			url_query = new URLSearchParams(url.search);
		// Only proceed if the referrer is a search engine.
		if(isFromSearchEngine || referrer_hostname.includes("youtube")){
			if (/cid=ps|s_kwcid=AL!|s_kwcid=AL!/i.test(url.search)) {
				retVal = true
			} else if( (url_query.get('cid')||"").startsWith("AL!") ){
				retVal = true
			} else if (/&ps%3|\?ps%3|&ps:|\?ps:/i.test(url.href)) {
				retVal = true
			} else if( url_query.get('gclid') ){
				retVal = true
			}
		}
		//console.log("[isPaidSearch()]", {url_query, channel,channel_detail, retVal});
		return retVal ? { channel, channel_detail: "Page Grouping (eVar26)" } : false;
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
		eVar0 = this._satellite.getVar('cid') || "",
		searchEngineDomains = [],
		channel = "Natural Search",
		channel_detail = "Search Keyword(s)";
	if (!referrer_hostname) {
		retVal = false; // If there is no referrer, it can't be natural search
	} else if (eVar0) {
		retVal = false; // If there is a cid, it can't be natural search
	} else if (referrer_hostname.includes("mail")){
		// If the referrer hostname contains "mail", it can't be natural search
		retVal = false;
	} else {
	  // This list of search engines extracted from Adobe on 1/8/2025.
	  searchEngineDomains = ["adsensecustomsearchads.com", "aol.co.uk", "aol.com",
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
		"yandex.kz", "yandex.ru", ];

			// The logic checks if the hostname ends with any of the domains in the list
			for (var i = 0; i < searchEngineDomains.length; i++) {
				if (referrer_hostname.endsWith(searchEngineDomains[i])) {
					//_satellite.logger.log('[DE_marketing_channels]', "checking", referrer_hostname, "ends with", searchEngineDomains[i]);
					retVal = { channel, channel_detail };
				break;
				}
			}
		}
		console.log("[isNaturalSearch()]", {referrer_hostname, matched: searchEngineDomains[i], retVal});
	 	return retVal
	},
	// Rule 3 & 4: Email
	  // @param {url} url - The URL object to check.
	isEmail: function (url) {
		var url_query = new URLSearchParams(url.search);
		var retVal = false,
			channel = "Email",
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
			retVal = {channel, channel_detail: eVar0};
		}
		/* Rule 4: Email
		IF [ALL] are true:
			* Query String Parameter `serviceid` [STARTS WITH] `em`
		THEN
			* Channel = "Email"
			* Channel Detail = "Query String Parmeter `serviceid`"
		*/
		else if (query_serviceId.startsWith("em")) {
			retVal = {channel, channel_detail: query_serviceId};
		}
		console.log("[isEmail()]", {eVar0, query_cid, query_serviceId, retVal});
		return retVal;
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
		var retVal = false,
	  		channel = "Offline (Vanity url)",
			channel_detail = eVar0;
		if (
			eVar0.startsWith("vt:") ||
			eVar0.startsWith("qr:") ||
			eVar0.startsWith("dm")
		) {
			retVal = { channel, channel_detail };
		}
		console.log("[isOfflineVanityUrl()]", {eVar0, retVal});
		return retVal;
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
			retVal = { channel, channel_detail: eVar0 };
		}
		console.log("[isSMSorPushNotification()]", {eVar0, retVal});
		return retVal;
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
		var retVal = false,
			url_query = new URLSearchParams(url.search);
		var channel = "Display ClickThrough",
			eVar0 = this._satellite.getVar("cid") || "",
			eVar33 = this._satellite.getVar("clean_url") || "",
			query_cid = url_query.get("cid") || "",
			query_ef_id = url_query.get("ef_id") || "";
		if( /^di/i.test(query_cid)   ||  // ?cid starts with `di`
			/^di:/i.test(eVar0)      ||  // cid reports starts with `di:`
			/:d$/i.test(eVar33)      ||  // clean_url ends with `:d`
			/:d$/i.test(query_ef_id)     // ?ef_id ends with `:d`
		){
			retVal = {channel, channel_detail: query_cid}
		}
		console.log("[isDisplayClickThrough()]", {eVar0, eVar33, query_cid, query_ef_id, retVal});
		return retVal;
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
                retVal = {channel, channel_detail:referrer_hostname};
            }
        }
		if(eVar0.startsWith('sc:')) {
			retVal = {channel, channel_detail:referrer_hostname};
		}
		console.log("[isSocialNetworks()]", {eVar0, referrer_hostname, retVal});
		return retVal;
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
		var retVal = false,
			eVar0 = this._satellite.getVar('cid') || "";
		var channel = "Third Party",
			channel_detail = eVar0;
		if (eVar0.startsWith('tp:')) {
			return {channel, channel_detail};
		}
		console.log("[isThirdParty()]", {eVar0, retVal});
		return retVal;
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
		var retVal = false,
			eVar0 = this._satellite.getVar('cid') || "";
		var channel = "Universal Links",
			channel_detail = eVar0;
		if (eVar0.startsWith('ul:')) {
			return {channel, channel_detail};
		}
		console.log("[isUniversalLink()]", {eVar0, retVal});
		return retVal;
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
		var retVal = false,
			eVar0 = this._satellite.getVar('cid') || "";
		var channel = "Magic Links",
			channel_detail = eVar0;
		if (eVar0.startsWith('ml:')) {
			return {channel, channel_detail};
		}
		console.log("[isMagicLink()]", {eVar0, retVal});
		return retVal;
	},
	// Rule 12 & 13 Referring Domains
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
			isFirstHitOfVisit = this._satellite.getVar('page_views_session') === "1" ? true : false,
			isInternal = this.isInternal(referrer),
			eVar0 = this._satellite.getVar('cid') || "",
			channel = "Referring Domains";
		//console.log("[isReferringDomains()]", {isFirstHitOfVisit, sessionPageViews});

		// If the referrer is internal, we do NOT want to trigger this rule.
		if (isInternal) {
			retVal = false;
		}
		else if (referrer_hostname && (isFirstHitOfVisit || isInternal!==false)) {
			retVal = {channel,channel_detail:referrer_hostname};
		}
		/* Rule 13 Referring Domains
		IF [ALL] are true:
			* CID Reports (eVar0) [STARTS WITH] `rd:`
		THEN
			* Channel = "Referring Domains"
			* Channel Detail = "Referring Domain"
		*/
		else if (eVar0.startsWith('rd:')) {
			retVal = {channel,channel_detail:referrer_hostname};
		}
		console.log("[isReferringDomains()]", {eVar0, referrer_hostname, isFirstHitOfVisit, retVal, isInternal});
		return retVal
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
		console.log("[isDisplayViewThrough()]", {s_kwcid, url_query, cleanURL, referrer_hostname, retVal});
		return retVal
	},
	/* Rule 15 Display (View and Click) */
	isDisplayViewAndClick: function(url){
		/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		BUG: THIS RULE WOULD NEVER BE TRIGGERED
		BECAUSE 14 WOULD CATCH IT FIRST
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
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
			channel = "Display (View and Click)";
		var s_kwcid = url_query.get('s_kwcid') || "",
			eVar0 = url_query.get('cid');
		if (s_kwcid.startsWith('AC!')) {
			retVal = {channel,channel_detail:eVar0}
		}
		console.log("[isDisplayViewAndClick()]", {eVar0, s_kwcid, url_query, retVal});
		return retVal
	},
	/* Rule 16 Origin App */
	isOriginApp: function(url, userAgent, digitalData){
		/* Rule 16 Origin App
		IF [ANY] are true:
			* Native Wrapper? [EQUALS] `yes`
			* Query String Parmeter `openInExtBrowser` [EQUALS] `true`
			* Query String Parmeter `oiw` [EQUALS] `yes` || `true`
		THEN
			* Channel = "Origin App"
			* Channel Detail = "Page Domain And Path"
		*/
		var retVal = false,
			native_wrapper = this._satellite.getVar('is_native_app'),
			url_query = new URLSearchParams(url.search),
			channel = "Origin App";
		var openInExtBrowser = url_query.get('openInExtBrowser') || "",
			oiw = url_query.get('oiw') || "";

		if (native_wrapper === "yes" || openInExtBrowser === "true" || oiw === "yes" || oiw === "true") {
			retVal = {channel,channel_detail:"Page Domain And Path"}
		}
		// Uncomment to debug
		console.log("[isOriginApp()]", {native_wrapper, openInExtBrowser, oiw, retVal});
		return retVal
	},
	/* Rule 17 Internal */
	isInternal: function(referrer){
		/* Rule 17 Internal
		IF [ALL] are true:
			* Referrer Matches Internal URL Filters ie pages.retail.originenergy.com.au || careers.originenergy.com.au || littlebigidea.com.au || products.originenergy.com.au || pageup.com.au || originfoundation.com.au || aplng.com.au || originlpg.com.au || .originenergy.com.au || online.originenergy.com.au || movingservices.originenergy.com.au || originfoundationknowledgehub.com.au || dataportal-local.originenergy  || id.originenergy.com.au || employeeoffer.originenergy.com.au || online.originbroadband.com.au || support.originenergy.com.au || cleverly.originenergy.com.au  || originfoundation.org.au
			* Is First Hit of Visit

		THEN
			* Channel = "Internal"
			* Channel Detail = "Page"
		*/
		var retVal = false,
			referrer_hostname = (referrer instanceof URL) ? referrer.hostname : "",
			channel = "Internal",
			channel_detail = "Page"
		if (!referrer_hostname) {
            retVal = false;
        }
		// This list of internal domains extracted from Adobe on 1/8/2025.
		var internalDomains = ["pages.retail.originenergy.com.au", "careers.originenergy.com.au",
			"littlebigidea.com.au", "products.originenergy.com.au", "pageup.com.au",
			"originfoundation.com.au", "aplng.com.au", "originlpg.com.au", ".originenergy.com.au",
			"online.originenergy.com.au", "movingservices.originenergy.com.au",
			"originfoundationknowledgehub.com.au", "dataportal-local.originenergy",
			"id.originenergy.com.au", "employeeoffer.originenergy.com.au",
			"online.originbroadband.com.au", "support.originenergy.com.au",
			"cleverly.originenergy.com.au", "originfoundation.org.au" ];

        // The logic checks if the hostname ends with any of the domains in the list
        for (var i = 0; i < internalDomains.length; i++) {
            if (referrer_hostname.endsWith(internalDomains[i])) {
                retVal = true;
            }
        }
		console.log("[isInternal()]", {referrer_hostname, retVal});
        return retVal ? {channel,channel_detail} : false
	},
	/* Rule 18 Personalisation */
	isPersonalisation: function(){
		/* Rule 18 Personalisation
		IF [ANY] are true:
			* -Personalisation-Activity-(eVar123)-
			* CID Reports (eVar0) [STARTS WITH] `ccd` || `ccrf` || `hpb`
		THEN
			* Channel = "Personalisation"
			* Channel Detail = "Button / Link Name (eVar29)"
		*/
		var retVal = false,
			eVar0 = this._satellite.getVar('cid') || "";
		var channel = "Personalisation",
			channel_detail = "Button / Link Name (eVar29)";
		if (eVar0.startsWith('ccd') || eVar0.startsWith('ccrf') || eVar0.startsWith('hpb')) {
			retVal = {channel, channel_detail};
		}
		console.log("[isPersonalisation()]", {eVar0, retVal});
		return retVal
	},
	/* Rule 19 Direct */
	isDirect: function(referrer){
		/* Rule 19 Direct
		IF [ALL] are true:
			* Referrer [DOES NOT EXIST]
			* Is First Hit of Visit
		THEN
			* Channel = "Direct"
			* Channel Detail = "Page"
		*/
		var retVal = false,
			referrer_hostname = (referrer instanceof URL) ? referrer.hostname : "",
			isFirstHitOfVisit = this._satellite.getVar('page_views_session') === "1" ? true : false,
			channel = "Direct",
			channel_detail = "Page";
		if (referrer_hostname === "" && isFirstHitOfVisit) {
			retVal = {channel,channel_detail};
		}
		console.log("[isDirect()]", {referrer_hostname, isFirstHitOfVisit, retVal});
		return retVal
	},
  }
  return marketingRules;
}
