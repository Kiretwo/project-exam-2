import React from "react";
import { Booking } from "../../types/Booking";
import styles from "./BookingDetails.module.scss";

interface BookingDetailsProps {
  booking: Booking;
}

/**
 * Displays the details of a booking including venue name and booking information
 */
const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => (
  <div className={styles["booking-details"]}>
    <h2>{booking.venue?.name}</h2>
    <p>
      <span className={styles["booking-detail-item"]}>
        <strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}
      </span>
      <span className={styles["booking-detail-item"]}>
        <strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}
      </span>
      <span className={styles["booking-detail-item"]}>
        <strong>Guests:</strong> {booking.guests}
      </span>
    </p>
  </div>
);

export default BookingDetails;
