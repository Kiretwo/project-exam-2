// src/components/detail-booking-form/DetailBookingForm.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAccessToken } from "../../api/auth/login";
import styles from "./DetailBookingForm.module.scss";

interface BookingInterval {
  start: Date;
  end: Date;
}

interface Props {
  venueId: string;
}

const DetailBookingForm: React.FC<Props> = ({ venueId }) => {
  const navigate = useNavigate();
  const token = getAccessToken();

  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bookedIntervals, setBookedIntervals] = useState<BookingInterval[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // fetch existing bookings
  useEffect(() => {
    (async () => {
      try {
        const baseUrl = import.meta.env.VITE_NOROFF_API_BASE_URL;
        const apiKey = import.meta.env.VITE_API_KEY;
        const res = await fetch(
          `${baseUrl}/holidaze/venues/${encodeURIComponent(
            venueId
          )}?_bookings=true`,
          { headers: { "X-Noroff-API-Key": apiKey } }
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = (await res.json()) as {
          data: { bookings: { dateFrom: string; dateTo: string }[] };
        };
        setBookedIntervals(
          json.data.bookings.map((b) => ({
            start: new Date(b.dateFrom),
            end: new Date(b.dateTo),
          }))
        );
      } catch (e) {
        console.error("Failed to load bookings:", e);
      }
    })();
  }, [venueId]);

  // detect overlap
  const hasOverlap = useMemo(() => {
    if (!start || !end) return false;
    return bookedIntervals.some(
      ({ start: bs, end: be }) => start <= be && end >= bs
    );
  }, [start, end, bookedIntervals]);

  // handle booking submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) {
      setError("Please select both start and end dates.");
      return;
    }
    if (hasOverlap) {
      setError("Selected dates overlap an existing booking.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_NOROFF_API_BASE_URL;
      const apiKey = import.meta.env.VITE_API_KEY;
      const res = await fetch(`${baseUrl}/holidaze/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": apiKey,
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          venueId,
          dateFrom: start.toISOString(),
          dateTo: end.toISOString(),
          guests,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.[0]?.message || `Error ${res.status}`);
      }
      setSuccess(
        `Booking confirmed from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}!`
      );
      setBookedIntervals((prev) => [...prev, { start, end }]);
      setBookingConfirmed(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // if already booked successfully, show confirmation
  if (bookingConfirmed && success) {
    return (
      <div className={styles["booking-confirmation"]}>
        <p className={styles.success}>{success}</p>
      </div>
    );
  }

  return (
    <form className={styles["detail-booking-form"]} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles["date-pickers"]}>
        <div className={styles.field}>
          <label htmlFor="detail-start">From</label>
          <DatePicker
            id="detail-start"
            selected={start}
            onChange={(d) => setStart(d)}
            minDate={new Date()}
            excludeDateIntervals={bookedIntervals}
            dateFormat="yyyy-MM-dd"
            className={styles["date-input"]}
            placeholderText="Select start date"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="detail-end">To</label>
          <DatePicker
            id="detail-end"
            selected={end}
            onChange={(d) => setEnd(d)}
            minDate={start || new Date()}
            excludeDateIntervals={bookedIntervals}
            dateFormat="yyyy-MM-dd"
            className={styles["date-input"]}
            placeholderText="Select end date"
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="detail-guests">Guests</label>
        <select
          id="detail-guests"
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

      {token ? (
        <button
          type="submit"
          className={styles["book-button"]}
          disabled={loading || hasOverlap}
        >
          {loading ? "Booking…" : "Book now"}
        </button>
      ) : (
        <button
          type="button"
          className={styles["book-button"]}
          onClick={() => navigate("/login")}
        >
          Log in to book
        </button>
      )}
    </form>
  );
};

export default DetailBookingForm;
