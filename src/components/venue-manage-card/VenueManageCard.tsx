import React from "react";
import styles from "./VenueManageCard.module.scss";

interface VenueData {
  id: string;
  name: string;
  description: string;
  media: { url: string; alt: string }[];
  price: number;
  maxGuests: number;
  rating: number;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
    lat: number;
    lng: number;
  };
  created: string;
  updated: string;
}

interface VenueManageCardProps {
  venue: VenueData;
  onEdit: (venueId: string) => void;
  onDelete: (venueId: string) => void;
}

const VenueManageCard: React.FC<VenueManageCardProps> = ({
  venue,
  onEdit,
  onDelete,
}) => {
  const hasImage = venue.media && venue.media.length > 0;
  const locationString = `${venue.location.city}${
    venue.location.country ? `, ${venue.location.country}` : ""
  }`;
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {/* Image on left */}
        <div className={styles["image-container"]}>
          {hasImage ? (
            <img
              src={venue.media[0].url}
              alt={venue.media[0].alt || venue.name}
              className={styles.image}
            />
          ) : (
            <div className={styles["no-image"]}>No Image</div>
          )}
        </div>

        {/* Content on right */}
        <div className={styles.details}>
          <div className={styles["details-content"]}>
            <h3 className={styles.name}>{venue.name}</h3>
            <p className={styles.location}>{locationString}</p>
            <p className={styles.guests}>Max guests: {venue.maxGuests}</p>
          </div>

          {/* Price in bottom right */}
          <div className={styles.price}>{venue.price} NOK/night</div>
        </div>
      </div>

      {/* Action buttons at bottom */}
      <div className={styles["action-buttons"]}>
        <button
          className={styles["edit-btn"]}
          onClick={() => onEdit(venue.id)}
          title="Edit venue"
        >
          ✏️ Edit Venue
        </button>
        <button
          className={styles["delete-btn"]}
          onClick={() => onDelete(venue.id)}
          title="Delete venue"
        >
          🗑️ Delete Venue
        </button>
      </div>
    </div>
  );
};

export default VenueManageCard;
