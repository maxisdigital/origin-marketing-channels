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
        default:
          return data_element;
      }
    },
    cid: function () {
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
      var location = new URL(mockWindow.location.href);
      return location.protocol + "//" + location.hostname + location.pathname;
    },
    page_views_session: function () {
      return (
        mockWindow.sessionStorage[
          "com.adobe.reactor.core.visitorTracking.pagesViewed"
        ] || undefined
      );
    },
  };
  return dataElements;
}
