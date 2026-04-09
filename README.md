# Wall Calendar React Component

A fully interactive, visually appealing **wall calendar** built with **React**, inspired by a physical wall calendar aesthetic. This project allows users to view monthly calendars, select date ranges, add notes, mark holidays, and download notes as a PDF.

---

## Features

- **Wall Calendar Layout**: Emulates a real wall calendar with a hero image for each month.
- **Day Range Selector**: Click to select a start and end date with clear visual highlights.
- **Integrated Notes Section**: Add notes to specific dates or across a date range. Notes persist using `localStorage`.
- **Holiday Markers**: Predefined holidays are highlighted in the calendar.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Animations**: Smooth "flip" animation when switching months.
- **PDF Export**: Download all notes for the current month as a PDF.

---

## Demo

<img width="1763" height="904" alt="image" src="https://github.com/user-attachments/assets/f9f72ca5-bb0b-4cbe-8ca3-be7a914a05a2" />
Add note feature
<img width="1763" height="904" alt="image" src="https://github.com/user-attachments/assets/cd03bb24-3056-4149-9db8-9b976950cb87" />

---

## Installation

1. Clone the repository:
git clone https://github.com/Techy-BhaweshPandey/wall-calendar.git


2. Navigate to the project folder:
cd wall-calendar


3. Install dependencies:
npm install


Start the development server:
npm start

Open [(https://viewcalendarapp.netlify.app/)] to view it in your browser.

---

## Usage

- Navigate months using the left/right arrows.
- Click on a day to start a range selection; click another day to set the end date.
- Click the **+ Add Note** button or any note icon to add/edit notes.
- Download notes for the months using the **Download Notes** button.

---

## Technologies Used

- **React** (Functional Components, Hooks)
- **Framer Motion** (Animations for month transitions)
- **React Icons** (Icons for navigation and notes)
- **jsPDF** (Export notes as PDF)
- **CSS** (Responsive styling)

---

## Project Structure
wall-calendar/
├─ src/
│ ├─ components/
│ │ └─ WallCalendar.js # Main calendar component
│ ├─ styles/
│ │ └─ calendar.css # Calendar styling
│ ├─ App.js
│ └─ index.js
├─ public/
├─ package.json
└─ README.md

## Repository Link

[https://github.com/Techy-BhaweshPandey/Calendar](https://github.com/Techy-BhaweshPandey/Calendar)

---

## Notes / To Do

- Add ability to delete individual notes.
- Integrate dynamic holiday API for multiple countries.
- Improve mobile layout with swipe gestures.
- Add theme switching based on month images/colors.
