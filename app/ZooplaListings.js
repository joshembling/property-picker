class ZooplaListings {
  constructor(listing) {
    this.listing = listing;
  }

  getChildElements() {
    return this.listing.querySelectorAll("*");
  }

  changeListingTextToBlack() {
    this.getChildElements().forEach((child) => {
      child.style.color = "black";
    });
  }

  getListingPrice() {
    let price = this.listing.querySelector(
      'p[data-testid="listing-price"]'
    ).textContent;
    price = price.replace("£", "");
    price = price.replace(new RegExp(",", "g"), "");

    return parseInt(price);
  }

  getListingBackgroundElements() {
    return this.listing.querySelectorAll(
      "div > div > div:first-of-type > div:nth-child(2) > div:first-of-type > a:first-of-type > div:first-of-type"
    );
  }
}

export default ZooplaListings;
