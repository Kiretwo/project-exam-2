import React from "react";
import styles from "./ReceivedBookings.module.scss";

interface Customer {
  name: string;
  email: string;
  avatar?: {
    url: string;
    alt: string;
  };
}

interface Venue {
  id: string;
  name: string;
  location: {
    address?: string;
    city?: string;
    country?: string;
  };
  media: Array<{
    url: string;
    alt: string;
  }>;
}

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  customer: Customer;
}

interface VenueWithBookings {
  venue: Venue;
  bookings: Booking[];
}

interface ReceivedBookingsProps {
  venuesWithBookings: VenueWithBookings[];
  loading: boolean;
  error: string;
}

const ReceivedBookings: React.FC<ReceivedBookingsProps> = ({
  venuesWithBookings,
  loading,
  error,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLocation = (location: Venue["location"]) => {
    const parts = [location.address, location.city, location.country].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  if (loading) {
    return (
      <div className={styles.receivedBookings}>
        <div className={styles.loading}>Loading received bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.receivedBookings}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  // Flatten all bookings from all venues
  const allBookings = venuesWithBookings.flatMap(({ venue, bookings }) =>
    bookings.map((booking) => ({ ...booking, venue }))
  );
  if (allBookings.length === 0) {
    return (
      <div className={styles.receivedBookings}>
        <div className={styles.emptyState}>
          <h3>No received bookings</h3>
          <p>You haven't received any bookings for your venues yet.</p>
          <p className={styles.helpText}>
            Make sure you have venues listed and customers can find them to make
            bookings.
          </p>
        </div>
      </div>
    );
  }

  // Sort bookings by date (most recent first)
  const sortedBookings = allBookings.sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  return (
    <div className={styles.receivedBookings}>
      <h3 className={styles.title}>Received Bookings</h3>
      <div className={styles.bookingsList}>
        {sortedBookings.map((booking) => (
          <div key={booking.id} className={styles.bookingCard}>
            <div className={styles.venueImage}>
              {booking.venue.media && booking.venue.media[0] ? (
                <img
                  src={booking.venue.media[0].url}
                  alt={booking.venue.media[0].alt || booking.venue.name}
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder}>No Image</div>
              )}
            </div>

            <div className={styles.bookingInfo}>
              <div className={styles.venueDetails}>
                <h4 className={styles.venueName}>{booking.venue.name}</h4>
                <p className={styles.location}>
                  {formatLocation(booking.venue.location)}
                </p>
              </div>

              <div className={styles.customerDetails}>
                <div className={styles.customerInfo}>
                  <div className={styles.customerAvatar}>
                    {booking.customer.avatar?.url ? (
                      <img
                        src={booking.customer.avatar.url}
                        alt={
                          booking.customer.avatar.alt || booking.customer.name
                        }
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {booking.customer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={styles.customerName}>
                      {booking.customer.name}
                    </p>
                    <p className={styles.customerEmail}>
                      {booking.customer.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.dates}>
                  <span className={styles.dateRange}>
                    {formatDate(booking.dateFrom)} -{" "}
                    {formatDate(booking.dateTo)}
                  </span>
                </div>
                <div className={styles.guests}>
                  <span className={styles.guestCount}>
                    {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                  </span>
                </div>
                <div className={styles.bookingDate}>
                  <span className={styles.createdDate}>
                    Booked on {formatDate(booking.created)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedBookings;
