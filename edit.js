//console.log(chrome.storage.local.get());

let previousUrl = window.location.href;
function checkForNextUrl() {
  if (window.location.href !== previousUrl) {
    previousUrl = window.location.href;
    if (previousUrl.includes("__next")) {
      setTimeout(checkForNextUrl, 500);
    } else {
      window.location.reload();
    }
  } else {
    setTimeout(checkForNextUrl, 500);
  }
}
checkForNextUrl();

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
}

const calculations = new Calculations();

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

const listings = document.querySelectorAll(
  'div[data-testid="regular-listings"] > div[id^="listing"]'
);

const pills = [
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

listings.forEach((listing) => {
  const zooplaListings = new ZooplaListings(listing);

  zooplaListings.changeListingTextToBlack();
  const price = zooplaListings.getListingPrice();
  const backgrounds = zooplaListings.getListingBackgroundElements();

  chrome.storage.local.get(null, function (items) {
    const combinedAnnualSalary = zooplaListings.getCombinedAnnualSalary(items);
    const combinedMonthlySalary =
      zooplaListings.getCombinedMonthlySalary(items);
    const combinedDeposit = zooplaListings.getCombinedDeposit(items);
    const mortgagePercentage = zooplaListings.getMortgagePercentage(items);
    const repaymentTerm = zooplaListings.getRepaymentTerm(items);

    if (!isNaN(price)) {
      const mortgageAffordability = calculations.getMortgageAffordability(
        price,
        combinedDeposit,
        mortgagePercentage,
        repaymentTerm,
        combinedMonthlySalary,
        0
      );
      const rentAffordability = calculations.getRentAffordability(
        price,
        combinedMonthlySalary,
        0
      );

      if (
        combinedAnnualSalary !== undefined &&
        combinedMonthlySalary !== undefined
      ) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("pill-wrapper");
        listing.prepend(wrapper);

        pills.map((pill, index) => {
          let p = zooplaListings.createElement("div", "pill");
          wrapper.appendChild(p);

          if (window.location.href.indexOf("to-rent") > -1) {
            percentage = rentAffordability.percentage;
            index === 2 ? p.remove() : "";
          } else {
            percentage = mortgageAffordability.percentage;
            index === 3 ? p.remove() : "";
          }

          //if (index === 0)
          if (percentage < 50) {
            p.style.background = pills[0].colour;
            p.textContent = pills[0].text;
          } else if (percentage >= 50 && percentage < 65) {
            p.style.background = pills[1].colour;
            p.textContent = pills[1].text;
          } else if (percentage >= 65 && percentage < 70) {
            p.style.background = pills[2].colour;
            p.textContent = pills[2].text;
          } else {
            p.style.background = pills[3].colour;
            p.textContent = pills[3].text;
          }

          if (index === 1)
            p.textContent = `Affordability rating: ${
              percentage <= 0
                ? "0%"
                : percentage >= 100
                ? "100%"
                : percentage + "%"
            }`;

          if (index === 2)
            if (mortgageAffordability.monthlyPayment <= 0) {
              p.remove();
            } else {
              p.textContent = `Est. monthly payment: £${mortgageAffordability.monthlyPayment.toFixed(
                2
              )}`;
            }

          if (index === 3)
            if (rentAffordability.targetSalaryNeeded !== null) {
              p.textContent = `Extra annual income needed: +£${rentAffordability.targetSalaryNeeded.toLocaleString(
                "en-US",
                { maximumFractionDigits: 0 }
              )}`;
            } else {
              p.remove();
            }
        });

        backgrounds.forEach((bg) => {
          bg.style.color = "#111 !important";

          if (percentage < 50) {
            bg.style.background = pills[0].colour;
          } else if (percentage >= 50 && percentage < 65) {
            bg.style.background = pills[1].colour;
          } else if (percentage >= 65 && percentage < 70) {
            bg.style.background = pills[2].colour;
          } else {
            bg.style.background = pills[3].colour;
          }
        });
      }
    }
  });
});
