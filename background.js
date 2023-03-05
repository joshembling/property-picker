chrome.tabs.onActivated.addListener(function (info) {
  chrome.tabs.get(info.tabId, function (change) {
    const matching = change.url.includes("zoopla.co.uk");

    if (matching) {
      console.log(change);
      chrome.action.setIcon({ path: "/icon_purple.png" });
    } else {
      console.log("not on zoopla");
      chrome.action.setIcon({ path: "/icon_alt.png" });
    }
  });
});
