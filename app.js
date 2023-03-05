class AffordabilityWindow {
  constructor() {
    this.personalAllowance = 12570;
    this.highestBasicRate = 50270;
    this.basicRate = this.highestBasicRate - this.personalAllowance;
    this.higherBracket = 150000;
  }

  calculateTax(income, taxableIncome) {
    let tax = 0;

    if (taxableIncome <= 0) {
      return 0;
    } else if (income <= this.highestBasicRate) {
      tax = taxableIncome * 0.2;
    } else if (income <= this.higherBracket) {
      let remainder = taxableIncome - this.basicRate;
      tax = this.basicRate * 0.2 + remainder * 0.4;
    } else {
      let higherRemainder = taxableIncome - this.higherBracket;
      let twentyPercent = taxableIncome - this.basicRate;
      let fortyPercent = twentyPercent - higherRemainder;

      tax = this.basicRate * 0.2 + fortyPercent * 0.4 + higherRemainder * 0.45;
    }

    return tax;
  }

  calculateNationalInsurance(income, taxableIncome) {
    let nationalInsurance = 0;
    let firstNIDeduction;
    let secondNIDeduction;

    if (income >= this.personalAllowance && income <= this.highestBasicRate) {
      nationalInsurance = (taxableIncome / 12) * 0.12 * 12;
    } else if (income > this.highestBasicRate) {
      let salaryAfterMidBracket = income - this.highestBasicRate;

      firstNIDeduction =
        ((this.highestBasicRate - this.personalAllowance) / 12) * 0.12 * 12;
      secondNIDeduction = (salaryAfterMidBracket / 12) * 0.02 * 12;

      nationalInsurance = firstNIDeduction + secondNIDeduction;
    }

    return nationalInsurance;
  }

  monthlySalaryAfterTaxandNI(annualWage, overStatePensionAge) {
    const income = annualWage;
    const taxableIncome = income - this.personalAllowance;

    const tax = this.calculateTax(income, taxableIncome);

    let nationalInsurance = 0;
    if (!overStatePensionAge) {
      nationalInsurance = this.calculateNationalInsurance(
        income,
        taxableIncome
      );
    }

    const totalDeductions = tax + nationalInsurance;
    const netIncome = income - totalDeductions;

    return netIncome / 12;
  }
}

const affordabilityWindow = new AffordabilityWindow();

// applicant 1
const annual_salary_0 = document.getElementById("annual_salary_0");
const monthly_salary_after_tax_0 = document.getElementById(
  "monthly_salary_after_tax_0"
);
const deposit_value_0 = document.getElementById("deposit_value_0");
const mortgage_percentage = document.getElementById("mortgage_percentage");
const repayment_term = document.getElementById("repayment_term");

// applicant 2
const annual_salary_1 = document.getElementById("annual_salary_1");
const monthly_salary_after_tax_1 = document.getElementById(
  "monthly_salary_after_tax_1"
);
const deposit_value_1 = document.getElementById("deposit_value_1");

const annual_salaries = [annual_salary_0, annual_salary_1];
const other_elements = [
  monthly_salary_after_tax_0,
  monthly_salary_after_tax_1,
  deposit_value_0,
  deposit_value_1,
  mortgage_percentage,
  repayment_term,
];

annual_salaries.forEach((as, i) => {
  as.addEventListener("keyup", (e) => {
    let monthlySalary = affordabilityWindow.monthlySalaryAfterTaxandNI(
      e.target.value,
      false
    );

    e.target.parentElement.nextElementSibling.nextElementSibling.firstElementChild.value =
      monthlySalary.toFixed();

    setChromeLocalStorage(as.name, e.target.value, true);
    setChromeLocalStorage(
      "monthly_salary_after_tax_" + i,
      monthlySalary.toFixed(),
      true
    );
  });
});

other_elements.forEach((element, i) => {
  element.addEventListener("keyup", (e) => {
    setChromeLocalStorage(element.name, e.target.value, true);
  });

  if (element === mortgage_percentage) {
    element.addEventListener("input", (e) => {
      e.target.value > 15 ? (e.target.value = 15) : e.target.value;
    });
  }

  if (element === repayment_term) {
    element.addEventListener("input", (e) => {
      e.target.value > 35 ? (e.target.value = 35) : e.target.value;
    });
  }
});

function setChromeLocalStorage(key, input, directInputValue = false) {
  if (directInputValue) {
    chrome.storage.local.set({ [key]: input }).then(() => {
      console.log(key + " is set to " + input);
    });
  } else {
    chrome.storage.local.set({ [key]: input.value }).then(() => {
      console.log(key + " is set to " + input.value);
    });
  }
}

// setting to chrome storage
const keys = [
  annual_salary_0,
  annual_salary_1,
  monthly_salary_after_tax_0,
  monthly_salary_after_tax_1,
  deposit_value_0,
  deposit_value_1,
  mortgage_percentage,
  repayment_term,
];
getKeys(keys);

async function getKeys(keys) {
  for (const key of keys) {
    const result = await new Promise((resolve) => {
      chrome.storage.local.get(key.name, (items) => {
        resolve(items);
      });
    });

    result[key.name] !== undefined ? (key.value = result[key.name]) : "";
  }
}

const updateBtn = document.getElementById("update");
updateBtn.addEventListener("click", () => {
  window.location.reload();
  chrome.tabs.reload();
});
