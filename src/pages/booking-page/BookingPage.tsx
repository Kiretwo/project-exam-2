import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./BookingPage.module.scss";
import { Booking } from "../../types/Booking";
import BookingItem from "../../components/bookings/BookingItem";

const API_BASE_URL = import.meta.env.VITE_NOROFF_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * BookingPage displays all bookings for the current user
 */
const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get authentication details
        const token = localStorage.getItem("accessToken");
        const username = localStorage.getItem("userName");

        if (!token || !username) {
          setIsAuthenticated(false);
          return;
        }

        // Fetch bookings with embedded venue details
        const res = await fetch(
          `${API_BASE_URL}/holidaze/profiles/${username}/bookings?_venue=true`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
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
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  return (
    <div className={styles["bookings-page"]}>
      <div className="container">
        <h1>Your Bookings</h1>
        {loading && (
          <div className={styles["bookings-message"]}>
            <p>Loading your bookings...</p>
          </div>
        )}{" "}
        {!isAuthenticated && (
          <div className={styles["bookings-message"]}>
            <p>You need to log in to view your bookings.</p>
            <Link to="/login" className={styles["login-link"]}>
              Go to Login Page
            </Link>
          </div>
        )}
        {error && isAuthenticated && (
          <div className={styles["bookings-error"]}>
            <p>Error: {error}</p>
          </div>
        )}
        {!loading && !error && isAuthenticated && bookings.length === 0 && (
          <div className={styles["bookings-message"]}>
            <p>You have no upcoming bookings.</p>
          </div>
        )}
        {!loading && !error && isAuthenticated && bookings.length > 0 && (
          <ul className={styles["bookings-list"]}>
            {bookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
