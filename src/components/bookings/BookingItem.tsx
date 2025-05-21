import React from "react";
import styles from "./BookingItem.module.scss";
import { Booking } from "../../types/Booking";
import BookingDetails from "./BookingDetails";

interface BookingItemProps {
  booking: Booking;
}

/**
 * Renders a single booking item with venue image and details
 */
const BookingItem: React.FC<BookingItemProps> = ({ booking }) => {
  // Check if venue data is available with proper null checks
  const hasVenueImage =
    booking.venue !== undefined &&
    booking.venue.media !== undefined &&
    booking.venue.media.length > 0;

  return (
    <li className={styles["booking-item"]}>
      {/* Render venue image if available */}
      {hasVenueImage && booking.venue && (
        <img
          src={booking.venue.media[0].url}
          alt={
            booking.venue.media[0].alt || booking.venue.name || "Venue image"
          }
          className={styles["booking-image"]}
        />
      )}

      {/* Booking details component */}
      <BookingDetails booking={booking} />
    </li>
  );
};

export default BookingItem;
