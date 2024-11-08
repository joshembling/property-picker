import PropertyListings from "./app/PropertyListings";
import RightMoveListings from "./app/RightMoveListings";
import ZooplaListings from "./app/ZooplaListings";
import Filters from "./app/Filters";

import DelayEnum from "./app/enums/Delay";

/**
 * LOADING LISTINGS FOR FORMATTING
 */
let previousUrl = window.location.href;

function checkZooplaForNextUrl() {
  if (window.location.href !== previousUrl) {
    previousUrl = window.location.href;
    if (previousUrl.includes("__next")) {
      setTimeout(checkZooplaForNextUrl, DelayEnum.CHECK_URL_ZOOPLA);
    } else {
      window.location.reload();
    }
  } else {
    setTimeout(checkZooplaForNextUrl, DelayEnum.CHECK_URL_ZOOPLA);
  }
}

function checkRightMoveForNextUrl() {
  if (previousUrl.includes("for-sale") || previousUrl.includes("to-rent")) {
    if (window.location.href !== previousUrl) {
      previousUrl = window.location.href;
      window.location.reload();
    } else {
      setTimeout(checkRightMoveForNextUrl, DelayEnum.CHECK_URL_RIGHTMOVE);
    }
  }
}

if (previousUrl.includes("zoopla")) {
  checkZooplaForNextUrl();
} else if (previousUrl.includes("rightmove")) {
  checkRightMoveForNextUrl();
}

/**
 * RIGHTMOVE
 */
const right_move_listings = document.querySelectorAll(
  "#l-searchResults > div > .l-searchResult "
);

right_move_listings.forEach((listing) => {
  listing.style.margin = "0.75rem 0";
  const rightMoveListings = new RightMoveListings(listing);
  const listingData = new PropertyListings();

  rightMoveListings.changeListingTextToBlack();
  const price = rightMoveListings.getListingPrice();

  const backgrounds = rightMoveListings.getListingBackgroundElements();
  const footerBackgrounds = rightMoveListings.getListingFooterElements();

  chrome.storage.local.get(null, function (items) {
    listingData.formatListings(listing, items, price, backgrounds);

    footerBackgrounds.forEach((bg) => {
      bg.style.color = "#111 !important";

      if (listingData.percentage < 50) {
        bg.style.background = listingData.pills[0].colour;
      } else if (listingData.percentage >= 50 && listingData.percentage < 65) {
        bg.style.background = listingData.pills[1].colour;
      } else if (listingData.percentage >= 65 && listingData.percentage < 70) {
        bg.style.background = listingData.pills[2].colour;
      } else if (listingData.percentage >= 70) {
        bg.style.background = listingData.pills[3].colour;
      }
    });
  });
});

/**
 * ZOOPLA
 */
const zoopla_listings = document.querySelectorAll(
  'div[data-testid="regular-listings"] > div > div[id^="listing"]'
);

zoopla_listings.forEach((listing) => {
  const zooplaListings = new ZooplaListings(listing);
  const listingData = new PropertyListings();

  zooplaListings.changeListingTextToBlack();
  const price = zooplaListings.getListingPrice();
  const backgrounds = zooplaListings.getListingBackgroundElements();

  chrome.storage.local.get(null, function (items) {
    listingData.formatListings(listing, items, price, backgrounds);
  });
});

/**
 * FILTERING
 */

if (window.location.href.indexOf("zoopla") != -1) {
  new Filters('div[data-testid="search-results-header-control"]', 'zoopla');
}

if (window.location.href.indexOf("rightmove") != -1) {
  new Filters("#keyword-search-container", 'rightmove');
}