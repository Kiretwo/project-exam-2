// src/components/booking-form/BookingForm.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./BookingForm.module.scss";

export interface BookingParams {
  location: string;
  start: Date;
  end: Date;
  guests: number;
}

interface Props {
  onSearch: (params: BookingParams) => void;
}

const BookingForm: React.FC<Props> = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(new Date());
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  // keep end >= start
  const handleStartDateChange = (d: Date | null) => {
    if (!d) return;
    setStart(d);
    if (end && d > end) setEnd(d);
  };
  const handleEndDateChange = (d: Date | null) => {
    if (d && start && d < start) return; // guard
    setEnd(d);
  };

  // detect native picker
  const [hasNative, setHasNative] = useState(false);
  useEffect(() => {
    const inp = document.createElement("input");
    inp.type = "date";
    setHasNative(
      inp.type === "date" && typeof (inp as any).showPicker === "function"
    );
  }, []);

  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current && typeof (ref.current as any).showPicker === "function") {
      (ref.current as any).showPicker();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start && end) {
      onSearch({ location, start, end, guests });
      // example of navigating with query params
      const qp = new URLSearchParams({
        location,
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
        guests: guests.toString(),
      }).toString();
      navigate(`/search?${qp}`);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form className={styles.bookingForm} onSubmit={handleSubmit}>
      {/* 1) Location */}
      <div className={styles.field}>
        <label htmlFor="location">Where to?</label>
        <input
          id="location"
          type="text"
          placeholder="City or venue name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      {/* 2–3) Dates */}
      <div className={styles.datePickers}>
        {/* From */}
        <div className={styles.field}>
          <label htmlFor="start">From</label>
          {hasNative ? (
            <input
              id="start"
              ref={startRef}
              type="date"
              min={today}
              value={start?.toISOString().slice(0, 10) || ""}
              onFocus={() => openPicker(startRef)}
              onClick={() => openPicker(startRef)}
              onChange={(e) => handleStartDateChange(new Date(e.target.value))}
              required
              className={styles.dateInput}
            />
          ) : (
            <DatePicker
              id="start"
              selected={start}
              onChange={handleStartDateChange}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className={styles.dateInput}
              placeholderText="Select date"
              required
              popperPlacement="bottom-start"
            />
          )}
        </div>

        {/* To */}
        <div className={styles.field}>
          <label htmlFor="end">To</label>
          {hasNative ? (
            <input
              id="end"
              ref={endRef}
              type="date"
              min={start ? start.toISOString().slice(0, 10) : today}
              value={end?.toISOString().slice(0, 10) || ""}
              onFocus={() => openPicker(endRef)}
              onClick={() => openPicker(endRef)}
              onChange={(e) => handleEndDateChange(new Date(e.target.value))}
              required
              className={styles.dateInput}
            />
          ) : (
            <DatePicker
              id="end"
              selected={end}
              onChange={handleEndDateChange}
              minDate={start || new Date()}
              dateFormat="yyyy-MM-dd"
              className={styles.dateInput}
              placeholderText="Select date"
              required
              popperPlacement="bottom-start"
            />
          )}
        </div>
      </div>

      {/* 4) Guests */}
      <div className={styles.field}>
        <label htmlFor="guests">Guests</label>
        <select
          id="guests"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Guest{i > 0 && "s"}
            </option>
          ))}
        </select>
      </div>

      {/* 5) Submit */}
      <button type="submit" className={styles.searchButton}>
        Search
      </button>
    </form>
  );
};

export default BookingForm;
