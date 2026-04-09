import React, { useState, useEffect, useMemo,useCallback } from "react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFileDownload,
  FaPlus,
  FaBook
} from "react-icons/fa";
import "../styles/calendar.css";

const holidays = {
  "2026-01-01": "New Year's Day",
  "2026-08-15": "Independence Day",
  "2026-12-25": "Christmas Day",
  "2026-01-26": "Republic Day",
};

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const monthColors = [
  "#FFCDD2","#C8E6C9","#BBDEFB","#FFF9C4","#D1C4E9","#FFE0B2",
  "#B2EBF2","#F0F4C3","#FFECB3","#F8BBD0","#CFD8DC","#D7CCC8"
];

const monthImages = [
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
];

function WallCalendar() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [notes, setNotes] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState("");
  const [rangeStart, setRangeStart] = useState(todayStr);
  const [rangeEnd, setRangeEnd] = useState(todayStr);
  const [clickRange, setClickRange] = useState({start: null, end: null});
  const [flipDirection, setFlipDirection] = useState(1);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("calendarNotes")) || {};
    setNotes(saved);
    document.body.style.backgroundColor = monthColors[currentMonth];
  }, [currentMonth]);

  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const generateCalendar = useCallback((month, year) => {
  let days = new Date(year, month + 1, 0).getDate();
  if (month === 1) days = isLeapYear(year) ? 29 : 28;
  const firstDay = new Date(year, month, 1).getDay();
  const cal = [];
  let week = Array(firstDay).fill(null);

  for (let d = 1; d <= days; d++) {
    week.push(d);
    if (week.length === 7) {
      cal.push(week);
      week = [];
    }
  }
  if (week.length) cal.push(week);
  return cal;
}, []);

  // Memoized calendar for performance
  const calendar = useMemo(() => generateCalendar(currentMonth, currentYear), [currentMonth, currentYear, generateCalendar]);

  const saveNotes = () => {
    const updated = { ...notes };
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      updated[key] = modalNote;
    }

    setNotes(updated);
    localStorage.setItem("calendarNotes", JSON.stringify(updated));
    setModalOpen(false);
    setModalNote("");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Notes for ${monthNames[currentMonth]} ${currentYear}`, 10, 10);
    let y = 20;
    Object.entries(notes).forEach(([date, note]) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${date}: ${note}`, 10, y);
      y += 10;
    });
    doc.save("calendar-notes.pdf");
  };

  const changeMonth = (dir) => {
    setFlipDirection(dir === "next" ? 1 : -1);
    let m = currentMonth;
    let y = currentYear;
    dir === "next" ? m++ : m--;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setCurrentMonth(m);
    setCurrentYear(y);
    setClickRange({start: null, end: null});
  };

  const handleDateClick = (dateStr) => {
    if (!clickRange.start || (clickRange.start && clickRange.end)) {
      setClickRange({ start: dateStr, end: null });
      setRangeStart(dateStr);
      setRangeEnd(dateStr);
    } else if (clickRange.start && !clickRange.end) {
      const start = new Date(clickRange.start);
      const end = new Date(dateStr);
      let newRange;
      if (end < start) newRange = { start: dateStr, end: clickRange.start };
      else newRange = { start: clickRange.start, end: dateStr };
      setClickRange(newRange);
      setRangeStart(newRange.start);
      setRangeEnd(newRange.end);
    }
  };

  const isInRange = (dateStr) => {
    if (!clickRange.start) return false;
    const d = new Date(dateStr);
    const start = new Date(clickRange.start);
    const end = clickRange.end ? new Date(clickRange.end) : start;
    return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
  };

  const renderCalendarGrid = () =>
    calendar.flat().map((day, i) => {
      if (!day) return <div key={i}></div>;

      const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      const isHoliday = holidays[dateStr];

      return (
        <div
          key={i}
          tabIndex={0}
          role="button"
          aria-label={`Day ${day}${isHoliday ? " Holiday: " + holidays[dateStr] : ""}${notes[dateStr] ? " Note present" : ""}`}
          className={`day
            ${dateStr === todayStr ? "today" : ""}
            ${notes[dateStr] ? "has-note" : ""}
            ${isHoliday ? "holiday-day" : ""}
            ${clickRange.start === dateStr ? "start" : ""}
            ${clickRange.end === dateStr ? "end" : ""}
            ${isInRange(dateStr) ? "in-range" : ""}
          `}
          onClick={() => handleDateClick(dateStr)}
          onKeyDown={(e) => { if(e.key === "Enter" || e.key === " ") handleDateClick(dateStr) }}
        >
          {day}
          {isHoliday && <span className="holiday-label">{holidays[dateStr]}</span>}
          {notes[dateStr] && (
            <FaBook
              className="note-icon"
              onClick={() => {
                setModalNote(notes[dateStr]);
                setRangeStart(dateStr);
                setRangeEnd(dateStr);
                setClickRange({ start: dateStr, end: dateStr });
                setModalOpen(true);
              }}
            />
          )}
        </div>
      );
    });

  return (
    <div className="app">
      <div className="header">
        <button aria-label="Previous Month" onClick={() => changeMonth("prev")}><FaChevronLeft /></button>
        <h1>
          {monthNames[currentMonth]} {currentYear}
          <button className="add-btn" aria-label="Add Note" onClick={() => setModalOpen(true)}><FaPlus /></button>
        </h1>
        <button aria-label="Next Month" onClick={() => changeMonth("next")}><FaChevronRight /></button>
      </div>

      <div className="container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonth}
            className="image-panel"
            style={{ backgroundImage: `url(${monthImages[currentMonth]})` }}
            initial={{ rotateY: flipDirection * 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -flipDirection * 90, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>

        <div className="calendar">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="day-name">{d}</div>)}
          {renderCalendarGrid()}
        </div>
      </div>

      <div className="actions">
        <button className="download-btn" onClick={downloadPDF}><FaFileDownload /> Download Notes</button>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add / Edit Note</h3>
            <div className="date-range">
              <label>From:<input type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)} /></label>
              <label>To:<input type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} /></label>
            </div>
            <textarea placeholder="Write your note..." value={modalNote} onChange={e => setModalNote(e.target.value)} />
            <div className="modal-actions">
              <button className="save" onClick={saveNotes}>Save</button>
              <button className="cancel" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WallCalendar;