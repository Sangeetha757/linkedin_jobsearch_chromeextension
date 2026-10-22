/**
 * background.js — Phase 1
 * Service worker. Handles lifecycle events.
 * Will gain more responsibilities in later phases (API calls, caching, etc.)
 */

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install") {
    console.log("[Job Search Assistant] Extension installed. Version:", chrome.runtime.getManifest().version);
  } else if (details.reason === "update") {
    console.log("[Job Search Assistant] Extension updated to:", chrome.runtime.getManifest().version);
  }
});

// Log when a LinkedIn jobs page fully loads (useful for debugging Phase 2+)
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.indexOf("linkedin.com/jobs") !== -1
  ) {
    console.log("[Job Search Assistant] LinkedIn jobs page ready:", tab.url);
  }
});
