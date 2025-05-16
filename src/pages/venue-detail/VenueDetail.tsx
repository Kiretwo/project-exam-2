// src/pages/venue-detail/VenueDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import { FaWifi, FaParking, FaCoffee, FaPaw } from "react-icons/fa";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./VenueDetail.module.scss";
import DetailBookingForm from "../../components/booking-form/DetailBookingForm";

interface VenueDetailData {
  id: string;
  name: string;
  description: string;
  media: { url: string; alt: string }[];
  price: number;
  rating: number;
  location: {
    city: string;
    country: string;
  };
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
}

const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<VenueDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_NOROFF_API_BASE_URL;
        const apiKey = import.meta.env.VITE_API_KEY;
        const res = await fetch(
          `${baseUrl}/holidaze/venues/${encodeURIComponent(id)}`,
          { headers: { "X-Noroff-API-Key": apiKey } }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = (await res.json()) as { data: VenueDetailData };
        setVenue(json.data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load venue");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className={styles["loading"]}>Loading venue…</div>;
  if (error) return <div className={styles["error"]}>Error: {error}</div>;
  if (!venue) return null;

  // Read-more logic
  const fullText = venue.description;
  const limit = 300;
  const shortText = fullText.slice(0, limit);
  // Prepare amenities
  const amenities: {
    key: keyof VenueDetailData["meta"];
    label: string;
    icon: React.ReactNode; // Using React.ReactNode instead of JSX.Element
  }[] = [
    { key: "wifi", label: "Wi-Fi", icon: <FaWifi /> },
    { key: "parking", label: "Parking", icon: <FaParking /> },
    { key: "breakfast", label: "Breakfast", icon: <FaCoffee /> },
    { key: "pets", label: "Pets", icon: <FaPaw /> },
  ];

  return (
    <div className={styles["detail-page"]}>
      <div className={styles["carousel-wrapper"]}>
        <Carousel
          showThumbs={false}
          infiniteLoop
          emulateTouch
          showStatus={false}
          dynamicHeight={false}
        >
          {venue.media.map((m, i) => (
            <div key={i} className={styles.slide}>
              <img src={m.url} alt={m.alt || venue.name} />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>{venue.name}</h1>
          <p className={styles.location}>
            {venue.location.city}, {venue.location.country}
          </p>
          <div className={styles.meta}>
            <span className={styles.price}>{venue.price} NOK/night</span>
            <span className={styles.rating}>⭐ {venue.rating.toFixed(1)}</span>
          </div>

          <h2 className={styles["about-heading"]}>About this venue</h2>
          <p className={styles.description}>
            {expanded || fullText.length <= limit
              ? fullText
              : `${shortText.trim()}…`}
          </p>
          {fullText.length > limit && (
            <button
              className={styles["description-toggle"]}
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}

          <h3 className={styles["amenities-heading"]}>Amenities</h3>
          <div className={styles["amenities-list"]}>
            {amenities.map(({ key, label, icon }) =>
              venue.meta[key] ? (
                <div key={key} className={styles["amenity-item"]}>
                  <span className={styles["amenity-icon"]}>{icon}</span>
                  <span className={styles["amenity-label"]}>{label}</span>
                </div>
              ) : null
            )}
          </div>

          <DetailBookingForm venueId={venue.id} />
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
