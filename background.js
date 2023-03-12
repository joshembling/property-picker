chrome.tabs.onActivated.addListener(function (info) {
  chrome.tabs.get(info.tabId, function (change) {
    const matching =
      change.url.includes("zoopla.co.uk") ||
      change.url.includes("rightmove.co.uk");

    if (matching) {
      chrome.action.setIcon({ path: "/icon_purple.png" });
    } else {
      chrome.action.setIcon({ path: "/icon_alt.png" });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
  if (tab.active && change.url) {
    const matching =
      change.url.includes("zoopla.co.uk") ||
      change.url.includes("rightmove.co.uk");

    if (matching) {
      chrome.action.setIcon({ path: "/icon_purple.png" });
    } else {
      chrome.action.setIcon({ path: "/icon_alt.png" });
    }
  }
});
