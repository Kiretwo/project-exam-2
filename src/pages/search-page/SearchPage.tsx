import React, { useState } from "react";
import BookingForm, { BookingParams } from "../../components/booking-form/BookingForm";
import SearchResults from "../../components/search-results/SearchResults";
import { Venue } from "../../components/venue-card/VenueCard";
import styles from "./SearchPage.module.scss";

const SearchPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [error,  setError]  = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSearch = async ({ location }: BookingParams) => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_NOROFF_API_BASE_URL;
      const apiKey  = import.meta.env.VITE_API_KEY;
      // use the "search" endpoint to filter by name/description
      const res = await fetch(
        `${baseUrl}/holidaze/venues/search?q=${encodeURIComponent(location)}`,
        {
          headers: {
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const json = await res.json() as { data: Venue[] };
      setVenues(json.data);
    } catch (e: any) {
      console.error("Fetch venues failed:", e);
      setError(e.message || "Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.searchPage}>
      <section className={styles.hero}>
        <BookingForm onSearch={onSearch} />
      </section>

      <section className={styles.resultsContainer}>
        {loading && <p>Loading venues…</p>}
        {error   && <p className="error">{error}</p>}
        <SearchResults venues={venues} />
      </section>
    </div>
  );
};

export default SearchPage;
