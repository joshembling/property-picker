import DelayEnum from "./enums/Delay";

class Filters {
  constructor(element) {
    this.element = document.querySelector(element);

    this.results = [
      {
        text: "⛔️ Out of reach",
        textColour: "red",
        colour: "#fe7f7f",
        percentage: "0-49%",
      },
      {
        text: "💭 Possible but restrictive",
        textColour: "orange",
        colour: "#fba436",
        percentage: "50-64%",
      },
      {
        text: "👀 Within reach",
        textColour: "yellow",
        colour: "#fcfbb8",
        percentage: "65-69%",
      },
      {
        text: "✅ Affordable",
        textColour: "green",
        colour: "#7cffa7",
        percentage: "70-100%",
      },
    ];

    setTimeout(() => {
      this.createElements();
    }, DelayEnum.CREATE_FILTERS);

    setTimeout(() => {
      this.filterFunctionality();
    }, DelayEnum.LOAD_FILTER_FUNCTIONALITY);
  }

  createElements() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("btn-wrapper");

    this.element.parentElement.appendChild(wrapper);

    this.results.forEach((result) => {
      let btn = document.createElement("button");
      btn.classList.add("filter-btn");
      btn.classList.add(result.textColour);
      btn.textContent = result.text;
      btn.style.cssText = `
		    background: ${result.colour};
	    `;
      btn.style.fontFamily = 'inherit';
      wrapper.appendChild(btn);
    });
  }

  filterFunctionality() {
    const filterBtns = document.querySelectorAll(".filter-btn");

    filterBtns.forEach((btn) => {
      this.formatButton(btn);
      this.handleButtonEvent(btn);
    });
  }

  formatButton(btn) {
    chrome.storage.local.get(btn.classList[1], (items) => {
      const pills = document.querySelectorAll(`.pill.${btn.classList[1]}`);

      if (items[btn.classList[1]] == false) {
        btn.style.opacity = "0.2";

        pills.forEach((pill) => {
          pill.parentElement.parentElement.classList.add("hide");
        });
      } else {
        btn.style.opacity = "1";

        pills.forEach((pill) => {
          pill.parentElement.parentElement.classList.remove("hide");
        });
      }
    });
  }

  handleButtonEvent(btn) {
    btn.addEventListener("click", (e) => {
      if (e.target.style.opacity !== "0.2") {
        e.target.style.opacity = "0.2";

        chrome.storage.local.set({
          [colour]: false,
        });
      } else {
        e.target.style.opacity = "1";

        chrome.storage.local.set({
          [colour]: true,
        });
      }

      chrome.storage.local.get(btn.classList[1], (items) => {
        console.log('storage items', items);
      });

      const colour = e.target.classList[1];
      const pills = document.querySelectorAll(`.pill.${colour}`);

      pills.forEach((pill) => {
        if (!pill.parentElement.parentElement.classList.contains("hide")) {
          e.target.style.opacity = "0.2";
          pill.parentElement.parentElement.classList.add("hide");

          chrome.storage.local.set({
            [colour]: false,
          });
        } else {
          e.target.style.opacity = "1";
          pill.parentElement.parentElement.classList.remove("hide");

          chrome.storage.local.set({
            [colour]: true,
          });
        }
      });
    });
  }
}

export default Filters;
