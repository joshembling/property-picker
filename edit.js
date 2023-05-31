import PropertyListings from "./app/PropertyListings";
import RightMoveListings from "./app/RightMoveListings";
import ZooplaListings from "./app/ZooplaListings";

/**
 * LOADING LISTINGS FOR FORMATTING
 */
let previousUrl = window.location.href;

function checkZooplaForNextUrl() {
  if (window.location.href !== previousUrl) {
    previousUrl = window.location.href;
    if (previousUrl.includes("__next")) {
      setTimeout(checkZooplaForNextUrl, 100);
    } else {
      window.location.reload();
    }
  } else {
    setTimeout(checkZooplaForNextUrl, 100);
  }
}

function checkRightMoveForNextUrl() {
  if (previousUrl.includes("for-sale") || previousUrl.includes("to-rent")) {
    if (window.location.href !== previousUrl) {
      previousUrl = window.location.href;
      window.location.reload();
    } else {
      setTimeout(checkRightMoveForNextUrl, 300);
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
  console.log(price);
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
  'div[data-testid="regular-listings"] > div[id^="listing"]'
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

const title = document.querySelector('h1[data-testid="results-title"]');

const wrapper = document.createElement("div");
wrapper.classList.add("btn-wrapper");

title.parentElement.appendChild(wrapper);

const results = [
  {
    text: "red",
    colour: "#fe7f7f",
    percentage: "0-49%",
  },
  {
    text: "orange",
    colour: "#fba436",
    percentage: "50-64%",
  },
  {
    text: "yellow",
    colour: "#fcfbb8",
    percentage: "65-69%",
  },
  {
    text: "green",
    colour: "#7cffa7",
    percentage: "70-100%",
  },
];

results.forEach((result) => {
  let btn = document.createElement("button");
  btn.classList.add("filter-btn");
  btn.classList.add(result.text);
  btn.textContent = result.percentage;
  btn.style.cssText = `
    background: ${result.colour};
  `;

  wrapper.appendChild(btn);
});

const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const pills = document.querySelectorAll(`.pill.${e.target.classList[1]}`);

    pills.forEach((pill) => {
      if (
        pill.parentElement.parentElement.style.display === "" ||
        pill.parentElement.parentElement.style.display === "block"
      ) {
        e.target.style.opacity = "0.2";
        pill.parentElement.parentElement.style.display = "none";
      } else {
        e.target.style.opacity = "1";
        pill.parentElement.parentElement.style.display = "block";
      }
    });
  });
});
