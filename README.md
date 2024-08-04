# Custom Date Picker

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Welcome to the **Custom Date Picker** repository! This project is a web component-based date picker, implemented using JavaScript, HTML, and CSS. This README provides an overview of the functionality, code structure, and usage of the date picker. Additionally, it includes a screenshot to give a visual representation of the final implementation.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Usage](#usage)
- [Code Structure](#code-structure)
- [Screenshot](#screenshot)
- [License](#license)

## Introduction

The Custom Date Picker is a reusable and flexible date selection component that can be easily integrated into any web application. It leverages modern web component standards to encapsulate its functionality, ensuring that it can be used independently without interfering with other parts of the application.

## Features

- **Month and Year Selectors**: Dropdown selectors for months and years with a down arrow icon for ease of use.
- **Calendar Grid**: A grid layout displaying the days of the selected month, allowing users to select a specific date.
- **Date Formatting**: Displays the selected date in a readable format.
- **Customizable Styles**: Encapsulated CSS for easy customization and conflict-free integration.

## Usage

To use the Custom Date Picker, include the JavaScript and CSS files in your project and add the web component tags in your HTML.

### Installation

Clone the repository:
```bash
git clone https://github.com/MohmadAoun/Custom-date-picker.git
cd Custom-date-picker
```

Include the script in your HTML:
```html
<script src="path/to/date-picker.js"></script>
```

Add the date picker components to your HTML:
```html
<month-selector></month-selector>
<year-selector></year-selector>
<calendar-grid></calendar-grid>
<div class="selected-date">
  <span></span>
</div>
```

### Event Listeners

To handle changes in the selected month and year, add event listeners in your JavaScript:
```javascript
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
```

## Code Structure

The codebase is organized into classes representing different parts of the date picker. Each class is implemented as a web component:

- **DropdownSelector**: Base class for dropdown selectors.
- **MonthSelector**: Extends `DropdownSelector` for month selection.
- **YearSelector**: Extends `DropdownSelector` for year selection.
- **CalendarGrid**: Handles the generation and display of the calendar grid.

### Example

```javascript
class DropdownSelector extends HTMLElement {
  // Implementation of the base dropdown selector
}

class MonthSelector extends DropdownSelector {
  // Specific implementation for month selection
}

class YearSelector extends DropdownSelector {
  // Specific implementation for year selection
}

class CalendarGrid extends HTMLElement {
  // Implementation of the calendar grid
}
```

## Screenshot

![Date Picker Screenshot](screenshot.png)

---

For any questions or contributions, feel free to open an issue or submit a pull request. Thank you for using the Custom Date Picker!
