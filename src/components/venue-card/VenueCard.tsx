// src/components/venue-card/VenueCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./VenueCard.module.scss";

export interface Venue {
  id: string;
  name: string;
  price: number;
  location: {
    city: string;
    country: string;
  };
  media: { url: string; alt: string }[];
}

interface Props {
  venue: Venue;
}

const VenueCard: React.FC<Props> = ({ venue }) => {
  const img = venue.media[0];
  return (
    <Link to={`/venues/${venue.id}`} className={styles["card-link"]}>
      <article className={styles.card}>
        {img && (
          <img
            src={img.url}
            alt={img.alt || venue.name}
            className={styles.image}
          />
        )}
        <div className={styles.info}>
          <h3 className={styles.title}>{venue.name}</h3>
          <p className={styles.location}>
            {venue.location.city}, {venue.location.country}
          </p>
          <div className={styles.meta}>
            <span className={styles.price}>{venue.price} NOK/night</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default VenueCard;
