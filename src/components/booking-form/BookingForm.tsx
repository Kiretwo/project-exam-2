import React, { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start && end) {
      onSearch({ location, start, end, guests });
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
        <div className={styles.field}>
          <label htmlFor="start">From</label>
          <DatePicker
            id="start"
            selected={start}
            onChange={(date) => setStart(date)}
            dateFormat="yyyy-MM-dd"
            className={styles.dateInput}
            placeholderText="Select start date"
            required
            popperPlacement="bottom-start"
            popperModifiers={[
              {
                name: "offset",
                options: { offset: [0, 8] },
                fn: (state) => state,
              },
            ]}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="end">To</label>
          <DatePicker
            id="end"
            selected={end}
            onChange={(date) => setEnd(date)}
            dateFormat="yyyy-MM-dd"
            className={styles.dateInput}
            placeholderText="Select end date"
            required
            popperPlacement="bottom-start"
            popperModifiers={[
              {
                name: "offset",
                options: { offset: [0, 8] },
                fn: (state) => state,
              },
            ]}
          />
        </div>
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
