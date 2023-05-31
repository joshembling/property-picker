class RightMoveListings {
  constructor(listing) {
    this.listing = listing;
  }

  getChildElements() {
    return this.listing.querySelectorAll(".propertyCard-content *");
  }

  changeListingTextToBlack() {
    this.getChildElements().forEach((child) => {
      child.style.color = "black";
    });
  }

  getListingPrice() {
    let price = this.listing.querySelector(
      ".propertyCard-priceValue"
    ).textContent;

    price = price.replace("£", "");
    price = price.replace(new RegExp(",", "g"), "");

    return parseInt(price);
  }

  getListingBackgroundElements() {
    return this.listing.querySelectorAll(".propertyCard-content");
  }

  getListingFooterElements() {
    return this.listing.querySelectorAll(".propertyCard-content div");
  }
}

export default RightMoveListings;
