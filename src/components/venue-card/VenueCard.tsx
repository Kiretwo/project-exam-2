import React from "react";
import styles from "./VenueCard.module.scss";

export interface Venue {
  id: string;
  name: string;
  price: number;
  media: { url: string; alt: string }[];
  location: {
    city: string;
    country: string;
    // add more fields if you need
  };
}

interface Props {
  venue: Venue;
}

const VenueCard: React.FC<Props> = ({ venue }) => {
  const img = venue.media[0];
  return (
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
  );
};

export default VenueCard;
