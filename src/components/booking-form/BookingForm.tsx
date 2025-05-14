import React, { useState } from "react";
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
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location, start, end, guests });
  };

  return (
    <form className={styles.bookingForm} onSubmit={handleSubmit}>
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

      <div className={styles.datePickers}>
        <div className={styles.field}>
          <label htmlFor="start">From</label>
          <input
            id="start"
            type="date"
            value={start.toISOString().slice(0, 10)}
            onChange={(e) => setStart(new Date(e.target.value))}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="end">To</label>
          <input
            id="end"
            type="date"
            value={end.toISOString().slice(0, 10)}
            onChange={(e) => setEnd(new Date(e.target.value))}
            required
          />
        </div>
      </div>

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

      <button type="submit" className={styles.searchButton}>
        Search
      </button>
    </form>
  );
};

export default BookingForm;
