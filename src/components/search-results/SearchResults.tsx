import React from "react";
import VenueCard, { Venue } from "../venue-card/VenueCard";
import styles from "./SearchResults.module.scss";

interface Props {
  venues: Venue[];
}

const SearchResults: React.FC<Props> = ({ venues }) => (
  <div className={styles.results}>
    <h2>
      Showing {venues.length} venue{venues.length !== 1 && "s"}
    </h2>
    <div className={`grid cols-2 cols-3 ${styles.grid}`}>
      {venues.map((v) => (
        <VenueCard key={v.id} venue={v} />
      ))}
    </div>
  </div>
);

export default SearchResults;
