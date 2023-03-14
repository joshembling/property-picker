//console.log(chrome.storage.local.get());

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

class Calculations {
  monthlyPayment(price, interestRate, term) {
    let r = interestRate / 12 / 100;
    let n = term * 12;

    return (price * (r * (1 + r) ** n)) / ((1 + r) ** n - 1);
  }

  getMortgageAffordability(
    housePrice,
    deposit = 0,
    interestRate = 5,
    mortgageTerm = 25,
    monthlySalaryAfterTax,
    outgoings
  ) {
    const payment = this.monthlyPayment(
      parseInt(housePrice) - deposit,
      interestRate,
      mortgageTerm
    );

    let amountLeft = monthlySalaryAfterTax - outgoings;

    const amounts = {
      monthlyPayment: payment,
      finalAmount: (amountLeft - payment) / amountLeft,
    };
    const percentage = {
      percentage: parseInt((amounts.finalAmount * 100).toFixed()),
    };
    return { ...amounts, ...percentage };
  }

  getRentAffordability(rentalPrice, monthlySalaryAfterTax, outgoings) {
    const affordabilityRatio = 0.69; // replace with your desired affordability ratio

    let amountLeft = monthlySalaryAfterTax - outgoings;
    let affordability = (amountLeft - rentalPrice) / amountLeft;
    let targetSalaryNeeded = null;

    if (affordability < affordabilityRatio) {
      const amountLeftAtRatio = rentalPrice / (1 - affordabilityRatio);
      targetSalaryNeeded =
        (amountLeftAtRatio + outgoings - monthlySalaryAfterTax) * 12;
    }

    const amounts = {
      amountLeft: affordability,
      targetSalaryNeeded: targetSalaryNeeded,
    };
    const percentage = {
      percentage: parseInt((amounts.amountLeft * 100).toFixed()),
    };
    return { ...amounts, ...percentage };
  }

  getChromeStorageApplicantValues(key1, key2, message) {
    return parseInt(key1) && parseInt(key2)
      ? parseInt(key1) + parseInt(key2)
      : parseInt(key1) && !parseInt(key2)
      ? parseInt(key1)
      : !parseInt(key1) && parseInt(key2)
      ? parseInt(key2)
      : console.log(message);
  }

  getCombinedAnnualSalary(items) {
    return this.getChromeStorageApplicantValues(
      items.annual_salary_0,
      items.annual_salary_1,
      "No annual salary entered"
    );
  }

  getCombinedMonthlySalary(items) {
    return this.getChromeStorageApplicantValues(
      items.monthly_salary_after_tax_0,
      items.monthly_salary_after_tax_1,
      "No monthly salary entered"
    );
  }

  getCombinedDeposit(items) {
    return this.getChromeStorageApplicantValues(
      items.deposit_value_0,
      items.deposit_value_1,
      "No deposit entered"
    );
  }

  getMortgagePercentage(items) {
    return parseInt(items.mortgage_percentage)
      ? parseFloat(items.mortgage_percentage)
      : 5;
  }

  getRepaymentTerm(items) {
    return parseInt(items.repayment_term) ? parseInt(items.repayment_term) : 25;
  }

  createElement(element, classList) {
    let el = document.createElement(element);
    el.classList.add(classList);

    return el;
  }
}

const calculations = new Calculations();

class PropertyListings {
  constructor() {
    this.pills = [
      {
        text: "⛔️ Out of reach",
        colour: "#fe7f7f",
      },
      {
        text: "💭 Possible but restrictive",
        colour: "#fba436",
      },
      {
        text: "👀 Within reach",
        colour: "#fcfbb8",
      },
      {
        text: "✅ Affordable",
        colour: "#7cffa7",
      },
    ];

    this.percentage;
  }

  getCalculations(items) {
    return {
      combinedAnnualSalary: calculations.getCombinedAnnualSalary(items),
      combinedMonthlySalary: calculations.getCombinedMonthlySalary(items),
      combinedDeposit: calculations.getCombinedDeposit(items),
      mortgagePercentage: calculations.getMortgagePercentage(items),
      repaymentTerm: calculations.getRepaymentTerm(items),
    };
  }

  getPercentage(rentAffordability, mortgageAffordability) {
    if (window.location.href.indexOf("to-rent") > -1) {
      return (this.percentage = rentAffordability.percentage);
    } else {
      return (this.percentage = mortgageAffordability.percentage);
    }
  }

  getAffordabilityPercentage(index, pill) {
    if (index === 1)
      pill.textContent = `Affordability rating: ${
        this.percentage <= 0
          ? "0%"
          : this.percentage >= 100
          ? "100%"
          : this.percentage + "%"
      }`;
  }

  getEstimatedMonthlyPayment(index, mortgageAffordability, pill) {
    if (index === 2)
      if (mortgageAffordability.monthlyPayment <= 0) {
        pill.remove();
      } else {
        pill.textContent = `Est. monthly payment: £${mortgageAffordability.monthlyPayment.toFixed(
          2
        )}`;
      }
  }

  getExtraAnnualIncomeNeeded(index, rentAffordability, pill) {
    if (index === 3)
      if (rentAffordability.targetSalaryNeeded !== null) {
        pill.textContent = `Extra annual income needed: +£${rentAffordability.targetSalaryNeeded.toLocaleString(
          "en-US",
          { maximumFractionDigits: 0 }
        )}`;
      } else {
        pill.remove();
      }
  }

  colourPills(pill) {
    if (this.percentage < 50) {
      pill.style.background = this.pills[0].colour;
      pill.textContent = this.pills[0].text;
    } else if (this.percentage >= 50 && this.percentage < 65) {
      pill.style.background = this.pills[1].colour;
      pill.textContent = this.pills[1].text;
    } else if (this.percentage >= 65 && this.percentage < 70) {
      pill.style.background = this.pills[2].colour;
      pill.textContent = this.pills[2].text;
    } else {
      pill.style.background = this.pills[3].colour;
      pill.textContent = this.pills[3].text;
    }
  }

  colourBackgrounds(backgrounds) {
    backgrounds.forEach((bg) => {
      bg.style.color = "#111 !important";

      if (this.percentage < 50) {
        bg.style.background = this.pills[0].colour;
      } else if (this.percentage >= 50 && this.percentage < 65) {
        bg.style.background = this.pills[1].colour;
      } else if (this.percentage >= 65 && this.percentage < 70) {
        bg.style.background = this.pills[2].colour;
      } else {
        bg.style.background = this.pills[3].colour;
      }
    });
  }

  formatListings(listing, items, price, backgrounds) {
    const listingDataCalculations = this.getCalculations(items);

    if (!isNaN(price)) {
      const mortgageAffordability = calculations.getMortgageAffordability(
        price,
        listingDataCalculations.combinedDeposit,
        listingDataCalculations.mortgagePercentage,
        listingDataCalculations.repaymentTerm,
        listingDataCalculations.combinedMonthlySalary,
        0
      );
      const rentAffordability = calculations.getRentAffordability(
        price,
        listingDataCalculations.combinedMonthlySalary,
        0
      );

      if (
        listingDataCalculations.combinedAnnualSalary !== undefined &&
        listingDataCalculations.combinedMonthlySalary !== undefined
      ) {
        const wrapper = calculations.createElement("div", "pill-wrapper");
        listing.prepend(wrapper);

        this.pills.map((pill, index) => {
          let p = calculations.createElement("div", "pill");
          wrapper.appendChild(p);
          p.style.fontSize = "0.85rem";

          if (window.location.href.indexOf("to-rent") > -1) {
            index === 2 ? p.remove() : "";
          } else {
            index === 3 ? p.remove() : "";
          }

          this.getPercentage(rentAffordability, mortgageAffordability);
          this.colourPills(p);

          this.getAffordabilityPercentage(index, p);
          this.getEstimatedMonthlyPayment(index, mortgageAffordability, p);
          this.getExtraAnnualIncomeNeeded(index, rentAffordability, p);
        });

        this.colourBackgrounds(backgrounds);
      }
    }
  }
}

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
