const formatSelectedDate = (day, month, year) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const selectedDate = new Date(year, month, day);
  return `${dayNames[selectedDate.getDay()]}, ${day} ${
    monthNames[month]
  }, ${year}`;
};

class DropdownSelector extends HTMLElement {
  constructor(displayText, items, eventName) {
    super();
    this.attachShadow({ mode: "open" });
    this.displayText = displayText;
    this.items = items;
    this.eventName = eventName;
    this.createSelector();
    this.attachStyles();
    this.addEventListeners();
  }

  createSelector() {
    const div = document.createElement("div");
    div.classList.add("selector");

    const span = document.createElement("span");
    span.classList.add("display");
    span.textContent = this.displayText;

    const arrow = document.createElement("span");
    arrow.classList.add("arrow");
    arrow.innerHTML = "&#9662;"; // Unicode for down arrow

    div.appendChild(span);
    div.appendChild(arrow);
    this.shadowRoot.append(div);

    this.display = span;
  }

  attachStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .selector {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
      }
      .arrow {
        margin-left: 5px;
      }
      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #FFFFFF;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 0.5rem;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
      }
      .dropdown-option {
        padding: 0.5rem;
      }
    `;
    this.shadowRoot.append(style);
  }

  addEventListeners() {
    this.shadowRoot
      .querySelector(".selector")
      .addEventListener("click", (event) => this.showDropdown(event));
    document.addEventListener("click", (event) => {
      if (!this.shadowRoot.contains(event.target)) {
        this.closeDropdown();
      }
    });
  }

  showDropdown(event) {
    event.stopPropagation();
    this.closeDropdown();

    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");

    const fragment = document.createDocumentFragment();
    this.items.forEach((item, index) => {
      const option = document.createElement("div");
      option.classList.add("dropdown-option");
      option.textContent = item;
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        this.display.textContent = item;
        this.dispatchEvent(
          new CustomEvent(this.eventName, { detail: { index, item } })
        );
        this.closeDropdown();
      });
      fragment.appendChild(option);
    });

    dropdown.appendChild(fragment);
    this.shadowRoot.querySelector(".selector").appendChild(dropdown);
  }

  closeDropdown() {
    const existingDropdown = this.shadowRoot.querySelector(".dropdown");
    if (existingDropdown) {
      existingDropdown.remove();
    }
  }
}

class MonthSelector extends DropdownSelector {
  constructor() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonth = new Date().getMonth();
    super(months[currentMonth], months, "month-change");
  }
}

class YearSelector extends DropdownSelector {
  constructor() {
    const years = Array.from({ length: 101 }, (_, i) => 1970 + i);
    const currentYear = new Date().getFullYear();
    super(currentYear.toString(), years.map(String), "year-change");
  }
}

class CalendarGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.createGridContainer();
    this.attachStyles();
  }

  connectedCallback() {
    const currentDate = new Date();
    this.generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }

  createGridContainer() {
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");
    this.shadowRoot.append(gridContainer);
  }

  attachStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .grid-container {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
      }
      .grid-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        font-size: clamp(0.5rem, 1vw, 1rem);
        color: #43493e;
        cursor: pointer;
      }
      .grid-cell.selected {
        background-color: #386a20;
        border-radius: 50%;
        color: white;
      }
      .grid-cell.other-month {
        color: #80B9AD;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  generateCalendar(year, month) {
    const gridContainer = this.shadowRoot.querySelector(".grid-container");
    gridContainer.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell", "other-month");
      cell.textContent = prevMonthDays - i;
      cell.addEventListener("click", () =>
        this.changeMonth(-1, prevMonthDays - i, year, month)
      );
      gridContainer.appendChild(cell);
    }

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.textContent = day;
      cell.addEventListener("click", () => this.selectDate(day, month, year));
      gridContainer.appendChild(cell);
    }

    const remainingCells = 42 - (firstDay + totalDays);
    for (let i = 1; i <= remainingCells; i++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell", "other-month");
      cell.textContent = i;
      cell.addEventListener("click", () => this.changeMonth(1, i, year, month));
      gridContainer.appendChild(cell);
    }
  }

  changeMonth(offset, day, year, month) {
    const newDate = new Date(year, month + offset);
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();

    this.updateMonthSelector(newMonth);
    this.updateYearSelector(newYear);

    this.generateCalendar(newYear, newMonth);
    this.selectDate(day, newMonth, newYear);
  }

  updateMonthSelector(month) {
    const monthSelector = document
      .querySelector("month-selector")
      .shadowRoot.querySelector(".display");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    monthSelector.textContent = monthNames[month];
  }

  updateYearSelector(year) {
    const yearSelector = document
      .querySelector("year-selector")
      .shadowRoot.querySelector(".display");
    yearSelector.textContent = year.toString();
  }

  selectDate(day, month, year) {
    const gridContainer = this.shadowRoot.querySelector(".grid-container");
    const cells = gridContainer.querySelectorAll(".grid-cell");
    cells.forEach((cell) => cell.classList.remove("selected"));

    const selectedCell = Array.from(cells).find(
      (cell) =>
        cell.textContent == day && !cell.classList.contains("other-month")
    );
    if (selectedCell) {
      selectedCell.classList.add("selected");
    }

    const formattedDate = formatSelectedDate(day, month, year);
    document.querySelector(".selected-date span").textContent = formattedDate;
  }
}

// Register custom elements
customElements.define("calendar-grid", CalendarGrid);
customElements.define("month-selector", MonthSelector);
customElements.define("year-selector", YearSelector);

// Event listeners for updating the calendar
document
  .querySelector("month-selector")
  .addEventListener("month-change", (event) => {
    const year = parseInt(
      document
        .querySelector("year-selector")
        .shadowRoot.querySelector(".display").textContent,
      10
    );
    document
      .querySelector("calendar-grid")
      .generateCalendar(year, event.detail.index);
  });

document
  .querySelector("year-selector")
  .addEventListener("year-change", (event) => {
    const monthDisplay = document
      .querySelector("month-selector")
      .shadowRoot.querySelector(".display").textContent;
    const month = new Date(`${monthDisplay} 1`).getMonth();
    const year = parseInt(event.detail.item, 10);
    document.querySelector("calendar-grid").generateCalendar(year, month);
  });
