// marketing_channel_data_elements.js - Data Element Logic

/**
 * Creates and returns the dataElements object.
 * @param {object} mockWindow - A simulated window object with location, document, and sessionStorage.
 * @returns {object} The dataElements object with its methods configured for the provided mockWindow.
 */
export function createDataElements(mockWindow) {
  const dataElements = {
    getVar: function (data_element) {
      switch (data_element) {
        case "cid":
          return this.cid();
        case "branch_data":
          return this.branch_data();
        case "utm_campaign":
          return this.utm_campaign();
        case "clean_url":
          return this.clean_url();
        case "page_views_session":
          return this.page_views_session();
		case "is_native_app":
			return this.is_native_app();
		case "query_string":
			return this.query_string();
		case "query_param_scope":
			return this.query_param_scope();
		case "user_agent":
			return this.user_agent();
        default:
          return data_element;
      }
    },
    cid: function () {
		/*
		Name: DE_cid
		Extension: Core
		Type: Custom Code
		Description: Return the value of the ?cid query param or ?utm_campaign or the Branch.io cid field from sessionStorage.
		*/
      var getQueryParam = function (key) {
        var urlParams = new URLSearchParams(mockWindow.location.search);
        return urlParams.get(key);
      };
      var returnVal,
        cid = getQueryParam("cid") || "",
        sem = mockWindow.location.search.match(/(\?|\&)(ps%3A|ps:).+=/),
        referralCode = getQueryParam("referralCode"),
        branchData = this.getVar("branch_data"),
        utmCampaign = this.getVar("utm_campaign");
        //console.log("[DE_cid]", {returnVal, cid, sem, referralCode, branchData, utmCampaign, 'window.location': window.location});

      if (cid == "RAF" && referralCode) {
        returnVal = cid + "|" + referralCode;
      } else if (Array.isArray(sem)) {
        returnVal = decodeURIComponent(sem[0]).replace(/&|=/, "");
      } else if (!cid && utmCampaign) {
        returnVal = utmCampaign;
      } else if (cid) {
        returnVal = cid;
      } else {
        returnVal = (branchData || {}).cid;
      }
      return returnVal || "";
    },
    branch_data: function () {
      return undefined;
    },
    utm_campaign: function () {
      var url = new URL(mockWindow.location.href);
      var url_query = new URLSearchParams(url.search);
      return url_query.get("utm_campaign") || "";
    },
    clean_url: function () {
		/*	DE_clean_url.js
		Returns a cleaned up version of the url that matches the version stored in Jindabyne.

		Original:
		case when  position('?' in lower(url_evar15)) > 0 then (substring(url_evar15,1, position('?' in lower(url_evar15))-1))::VARCHAR(250)
		when url_evar15 like '/%' then ('<https://www.originenergy.com.au'||url_evar15)::VARCHAR(250)>
		when url_evar15 like 'www.%' then ('<https://'||url_evar15)::VARCHAR(250)>
		when (url_evar15 like '%/#%' and position('#' in reverse(url_evar15))<position('/' in reverse(url_evar15))) then (substring(url_evar15,1, position('#' in lower(url_evar15))-1))::VARCHAR(250)
		else url_evar15::VARCHAR(250) end as url_cleansed,
		*/
      return location.protocol + "//" + location.hostname + location.pathname;
    },
    page_views_session: function () {
      // We need to fudge this.
      return (
        mockWindow.sessionStorage[
          "com.adobe.reactor.core.visitorTracking.pagesViewed"
        ] || undefined
      );
    },
	is_native_app: function(){
		var retVal = "no", // Data Element is configured to return "no" by default.
			location = new URL(mockWindow.location.href),
			digitalData = mockWindow.digitalData || {};
		/* This rule contains custom logic to determine the isNative flag. Can return 2 possible values: "yes" / "no" */

		/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		BUG: THIS DATELEMENT SETS digital.isNative = yes,
		BUT NEVER BOTHERS TO READ IT
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/

		// For login and registration, return "yes" if native is present in the scope URL parameter (captured in the %query_param_scope% DE)
		if (this.getVar('query_param_scope').indexOf('native') > -1) {
			retVal = (digitalData.isNative = "yes");
		}
		// If user agent contains 'odin-mobile-app' then the user is in the Origin Mobile app.
		if (this.getVar('user_agent').indexOf('odin-mobile-app') > -1) {
			retVal = (digitalData.isNative = "yes");
		}
		// If oiw.html is present in the pathname
		if(location.pathname.indexOf('oiw.html') > -1) {
			retVal = (digitalData.isNative = "yes");
		}
		// If OIW is present as a query param
		var queryString = this.getVar('query_string');
		if(/(oiw=yes|oiw=true|oiw=1|openInExtBrowser=true)/i.test(queryString)){
			retVal = (digitalData.isNative = "yes");
		}

		// If isNative is set in the events array. Looks in 2 locations.
		if(typeof digitalData === "object" && Array.isArray(digitalData.events) && digitalData.events.length > 0 ){
			var mostRecentEvent = digitalData.events[digitalData.events.length-1];
			var dataObj = mostRecentEvent.event ? mostRecentEvent.event.detail.data : mostRecentEvent.detail.data
			var isNative = String(dataObj.isNative).toLowerCase();
			// Check for 'yes', 'true', 'no', or 'false'
			if(isNative === "yes" || isNative === "true"){
				retVal = (digitalData.isNative = "yes");
			}else if(isNative === "no" || isNative === "false"){
				retVal = (digitalData.isNative = "no");
			}
		}
		console.log("[is_native_app()]", {retVal, location, digitalData, 'query_param_scope': this.getVar('query_param_scope')});
		return retVal;
	},
	query_string: function(){
		// The data element simulates the query_string DE.
		return new URL(mockWindow.location.href).search || ""
	},
	query_param_scope: function(){
		// The data element simulates the query_param_scope DE.
		return new URLSearchParams(new URL(mockWindow.location.href).search).get('scope') || ""
	},
	user_agent: function(){
		// The data element simulates the query_param_scope DE.
		return mockWindow?.navigator?.userAgent
	}
  };
  return dataElements;
}
