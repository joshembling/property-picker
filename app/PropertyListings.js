import Calculations from "./Calculations";
const calculations = new Calculations();

import DelayEnum from "./enums/Delay";

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
      pill.textContent = `Affordability rating: ${this.percentage <= 0
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
      pill.classList.add("red");
    } else if (this.percentage >= 50 && this.percentage < 65) {
      pill.style.background = this.pills[1].colour;
      pill.textContent = this.pills[1].text;
      pill.classList.add("orange");
    } else if (this.percentage >= 65 && this.percentage < 70) {
      pill.style.background = this.pills[2].colour;
      pill.textContent = this.pills[2].text;
      pill.classList.add("yellow");
    } else {
      pill.style.background = this.pills[3].colour;
      pill.textContent = this.pills[3].text;
      pill.classList.add("green");
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

        setTimeout(() => {
          listing.prepend(wrapper);
        }, DelayEnum.LOAD_LISTINGS);

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

export default PropertyListings;
