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

export default Calculations;
