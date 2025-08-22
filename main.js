// main.js - Main Application Logic

import { examples } from "./marketing_channel_globals.js";
import { createDataElements } from "./marketing_channel_data_elements.js";
import { createMarketingRules } from "./marketing_channel_processing_rules.js";

// --- START: APPLICATION LOGIC ---
const urlInput = document.getElementById("url");
const referrerInput = document.getElementById("referrer");
const examplesSelect = document.getElementById("examples");
const testButton = document.getElementById("testButton");
const resultsBody = document.getElementById("results-body");
const pageViewsInput = document.getElementById("page_views_session");
const userAgentInput = document.getElementById("user_agent");
const digitalDataInput = document.getElementById("digital_data");

/**
 * Populates the dropdown with examples from the globals file.
 */
function populateExamples() {
  for (const key in examples) {
	const option = document.createElement("option");
	option.value = key;
	// Add spaces before capital letters for readability
	option.textContent = key
	  .replace(/([A-Z])/g, " $1")
	  .replace(/(\d+)/g, " $1")
	  .trim();
	examplesSelect.appendChild(option);
  }
}

/**
 * Preselect a preferred example.
 */
function preselectExample() {
  const preferredExample = "paidSearch"; // Change this to your preferred example key
  if (examples[preferredExample]) {
	examplesSelect.value = preferredExample;
	handleExampleChange(); // Trigger the change handler to populate inputs
  }
}

/**
 * Handles the change event for the examples dropdown.
 */
function handleExampleChange() {
  const selectedKey = examplesSelect.value;
  if (selectedKey && examples[selectedKey]) {
	const example = examples[selectedKey];
	urlInput.value = example.href || "";
	referrerInput.value = example.referrer || "";
	pageViewsInput.value = example.page_views_session || "1";
	userAgentInput.value = example.userAgent || "Mozilla/5.0 (compatible; default-ua/1.0)";
	if(example.isNative){
		digitalDataInput.value = JSON.stringify({"isNative":example.isNative} || {});
	}else if(example.events){
		digitalDataInput.value = JSON.stringify({"events":example.events} || {});
	}else{
		digitalDataInput.value = "";
	}
	runTests(); // Automatically run test on selection
  }
}

/**
 * The core function to run the marketing channel tests.
 */
function runTests() {
  const urlValue = urlInput.value || "https://www.originenergy.com.au/";
  const referrerValue = referrerInput.value;
  const pageViewsValue = pageViewsInput.value;
  const userAgentValue = userAgentInput.value;
  const digitalDataValue = digitalDataInput.value.trim() ? JSON.parse(digitalDataInput.value.trim()) : {};

  if (!urlValue) {
	resultsBody.innerHTML =
	  '<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Please enter a URL to test.</td></tr>';
	return;
  }

  let currentUrl;
  try {
	currentUrl = new URL(urlValue);
  } catch (e) {
	resultsBody.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Invalid URL format.</td></tr>`;
	return;
  }

  let currentReferrer = "";
  if (referrerValue) {
	try {
	  currentReferrer = new URL(referrerValue);
	} catch (e) {
	  // It's okay for referrer to be invalid or empty, treat as empty string
	}
  }

  let currentUserAgent = "";
  if (userAgentValue) {
	try {
	  currentUserAgent = userAgentValue;
	} catch (e) {
	  // It's okay for userAgent to be empty, treat as empty string
	}
  }

  let currentDigitalData = {};
  if (digitalDataValue) {
	try {
	  currentDigitalData = digitalDataValue;
	} catch (e) {
	  // It's okay for currentDigitalData to be empty, treat as empty object
	}
  }


  // Set up the mock window object for the data elements and rules to use
  const mockWindow = {
	location: {
	  href: currentUrl.href,
	  search: currentUrl.search,
	},
	document: {
	  referrer: currentReferrer ? currentReferrer.href : "",
	},
	sessionStorage: {
	  "com.adobe.reactor.core.visitorTracking.pagesViewed": pageViewsValue,
	},
	navigator: {
	  userAgent: currentUserAgent || "Mozilla/5.0 (compatible; default-ua/1.0)",
	},
	digitalData: currentDigitalData
  };

  // Create instances of the rules and data elements with the current context
  const dataElements = createDataElements(mockWindow);
  const marketingRules = createMarketingRules(dataElements);

  // Clear previous results
  resultsBody.innerHTML = "";

  // The order of these rules is important, as per Adobe Analytics processing order.
  const ruleExecutionOrder = [
	{
	  name: "1. Paid Search",
	  func: () => marketingRules.isPaidSearch(currentUrl, currentReferrer),
	},
	{
	  name: "2. Natural Search",
	  func: () => marketingRules.isNaturalSearch(currentReferrer),
	},
	{ name: "3 & 4. Email", func: () => marketingRules.isEmail(currentUrl) },
	{
	  name: "5. Offline / Vanity URL",
	  func: () => marketingRules.isOfflineVanityUrl(currentUrl),
	},
	{
	  name: "6. SMS / Push",
	  func: () => marketingRules.isSMSorPushNotification(),
	},
	{
	  name: "7. Display ClickThrough",
	  func: () => marketingRules.isDisplayClickThrough(currentUrl),
	},
	{
	  name: "8. Social Networks",
	  func: () => marketingRules.isSocialNetworks(currentUrl, currentReferrer),
	},
	{ name: "9. Third Party", func: () => marketingRules.isThirdParty() },
	{
	  name: "10. Universal Link",
	  func: () => marketingRules.isUniversalLink(),
	},
	{ name: "11. Magic Link", func: () => marketingRules.isMagicLink() },
	{
	  name: "12 & 13. Referring Domains",
	  func: () => marketingRules.isReferringDomains(currentReferrer),
	},
	{
	  name: "14. Display ViewThrough",
	  func: () =>
		marketingRules.isDisplayViewThrough(currentUrl, currentReferrer),
	},
	{
	  name: "15. Display View & Click",
	  func: () =>
		marketingRules.isDisplayViewAndClick(currentUrl, currentReferrer),
	},
	{
	  name: "16. Origin App",
	  func: () =>
		marketingRules.isOriginApp(currentUrl, currentUserAgent, currentDigitalData),
	},
	{
	  name: "17. Internal",
	  func: () =>
		marketingRules.isInternal(currentReferrer),
	},
	{
	  name: "18. Personalisation",
	  func: () =>
		marketingRules.isPersonalisation(currentUrl),
	},
	{
	  name: "19. Direct",
	  func: () =>
		marketingRules.isDirect(currentReferrer),
	},
  ];

  let firstMatchFound = false;
  ruleExecutionOrder.forEach((rule) => {
	const result = rule.func();
	const row = document.createElement("tr");

	let channel = "<em>No Match</em>";
	let detail = "<em>N/A</em>";

	if (result) {
	  channel = result.channel || "Error";
	  detail = result.channel_detail || "Error";
	  if (!firstMatchFound) {
		row.classList.add("highlight");
		firstMatchFound = true;
	  }
	}

	row.innerHTML = `
			<td class="px-6 py-4 whitespace-nowrap text-sm">${rule.name}</td>
			<td class="px-6 py-4 whitespace-nowrap text-sm">${channel}</td>
			<td class="px-6 py-4 whitespace-nowrap text-sm">${detail}</td>
		`;
	resultsBody.appendChild(row);
  });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", populateExamples);
document.addEventListener("DOMContentLoaded", preselectExample);
examplesSelect.addEventListener("change", handleExampleChange);
testButton.addEventListener("click", runTests);
