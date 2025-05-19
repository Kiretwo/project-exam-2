import React, { useEffect, useState } from "react";
import styles from "./BookingPage.module.scss";
import { Booking } from "../../types/Booking";

const API_BASE_URL = import.meta.env.VITE_NOROFF_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const username = localStorage.getItem("userName");
        if (!token || !username) {
          throw new Error('User not authenticated');
        }
        const res = await fetch(
          `${API_BASE_URL}/holidaze/profiles/${username}/bookings`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              'X-Noroff-API-Key': API_KEY,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch bookings: ${res.status}`);
        }
        const json = await res.json();
        setBookings(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }  
    };

    fetchBookings();
  }, []);

  return (
    <div className={styles["bookings-page"]}>
      <h1>Your Bookings</h1>
      {loading ? (
        <p>Loading your bookings...</p>
      ) : error ? (
        <p className={styles["bookings-error"]}>Error: {error}</p>
      ) : bookings.length === 0 ? (
        <p>You have no upcoming bookings.</p>
      ) : (
        <ul className={styles["bookings-list"]}>
          {bookings.map((booking) => (
            <li key={booking.id} className={styles["booking-item"]}>
              <h2>Venue ID: {booking.venueId}</h2>
              <p>
                From: {new Date(booking.dateFrom).toLocaleDateString()}
                <br />
                To: {new Date(booking.dateTo).toLocaleDateString()}
                <br />
                Guests: {booking.guests}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookingPage;
