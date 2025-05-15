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

  const handleStartDateChange = (date: Date | null) => {
    setStart(date);
    if (date && end && date > end) {
      setEnd(date); // Adjust end date if start date is after it
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEnd(date);
  };

  // detect once whether the browser supports native date + showPicker
  const [hasNative, setHasNative] = useState(false);
  useEffect(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "date");
    setHasNative(
      input.type === "date" && typeof (input as any).showPicker === "function"
    );
  }, []);

  // refs to trigger the native picker
  const startRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLInputElement | null>(null);

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current && typeof (ref.current as any).showPicker === "function") {
      (ref.current as any).showPicker();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start && end) {
      onSearch({ location, start, end, guests }); // Keep existing callback

      const queryParams = new URLSearchParams();
      queryParams.append("location", location);
      queryParams.append("start", start.toISOString().split("T")[0]); // Format as YYYY-MM-DD
      queryParams.append("end", end.toISOString().split("T")[0]); // Format as YYYY-MM-DD
      queryParams.append("guests", guests.toString());

      // Navigate to the search page with query parameters
      navigate(`/search?${queryParams.toString()}`);
    }
  };

  return (
    <form className={styles.bookingForm} onSubmit={handleSubmit}>
      {/* Location */}
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

      {/* Dates */}
      <div className={styles.datePickers}>
        {["start", "end"].map((field) => {
          const isStart = field === "start";
          const date = isStart ? start : end;
          const setDate = isStart
            ? (d: Date | null) => handleStartDateChange(d)
            : (d: Date | null) => handleEndDateChange(d);
          const ref = isStart ? startRef : endRef;

          return (
            <div key={field} className={styles.field}>
              <label htmlFor={field}>{isStart ? "From" : "To"}</label>

              {hasNative ? (
                <input
                  id={field}
                  ref={ref}
                  type="date"
                  value={date ? date.toISOString().slice(0, 10) : ""}
                  onFocus={() => openPicker(ref)}
                  onClick={() => openPicker(ref)}
                  min={
                    isStart
                      ? new Date().toISOString().slice(0, 10)
                      : start
                      ? start.toISOString().slice(0, 10)
                      : undefined
                  }
                  max={undefined} // Removed max restriction for both fields
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    if (!isNaN(d.getTime())) setDate(d);
                  }}
                  required
                  className={styles.dateInput}
                />
              ) : (
                <DatePicker
                  id={field}
                  selected={date}
                  onChange={(d: Date | null) => setDate(d)}
                  minDate={isStart ? new Date() : start || new Date()} // Add minDate for start date picker (today) and fallback to today if start is null
                  maxDate={undefined} // Removed maxDate restriction for both fields
                  dateFormat="yyyy-MM-dd"
                  className={styles.dateInput}
                  placeholderText="Select date"
                  required
                  popperPlacement="bottom-start"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Guests */}
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

      {/* Submit */}
      <button type="submit" className={styles.searchButton}>
        Search
      </button>
    </form>
  );
};

export default BookingForm;
