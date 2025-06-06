import React from "react";
import { useNavigate } from "react-router-dom";
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
}

const VenueManageCard: React.FC<VenueManageCardProps> = ({ venue, onEdit }) => {
  const navigate = useNavigate();
  const hasImage = venue.media && venue.media.length > 0;
  const locationString = `${venue.location.city}${
    venue.location.country ? `, ${venue.location.country}` : ""
  }`;

  const handleCardClick = () => {
    navigate(`/venues/${venue.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when edit button is clicked
    onEdit(venue.id);
  };
  return (
    <div className={styles.card} onClick={handleCardClick}>
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
          {/* Edit button as a full-width block at the top of details */}{" "}
          <div className={styles["edit-btn-row"]}>
            <button
              className={styles["edit-btn"]}
              onClick={handleEditClick}
              title="Edit venue"
            >
              Edit Venue
            </button>
          </div>
          <div className={styles["details-content"]}>
            <h3 className={styles.name}>{venue.name}</h3>
            <p className={styles.location}>{locationString}</p>
            <p className={styles.guests}>Max guests: {venue.maxGuests}</p>
          </div>
          {/* Price in bottom right */}
          <div className={styles.price}>{venue.price} NOK/night</div>
        </div>
      </div>
    </div>
  );
};

export default VenueManageCard;
