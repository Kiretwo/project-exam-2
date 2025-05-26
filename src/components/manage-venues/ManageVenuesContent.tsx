import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import styles from "./ManageVenuesContent.module.scss";
import VenueManageCard from "../venue-manage-card/VenueManageCard";
import { API_PROFILE_VENUES } from "../../api/constants";
import { headers } from "../../api/headers";

interface Media {
  url: string;
  alt: string;
}

interface Location {
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
}

interface Meta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: Meta;
  location: Location;
}

interface ManageVenuesContentProps {
  className?: string;
}

const ManageVenuesContent: React.FC<ManageVenuesContentProps> = ({
  className = "",
}) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError(null);
      const username = localStorage.getItem("userName");
      const token = localStorage.getItem("accessToken");

      if (!username || !token) {
        setError("Please log in to view your venues");
        setLoading(false);
        return;
      }

      const response = await fetch(API_PROFILE_VENUES(username), {
        headers: headers(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch venues: ${response.statusText}`);
      }

      const result = await response.json();
      setVenues(result.data || []);
    } catch (err) {
      console.error("Error fetching venues:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };

  const handleEditVenue = (venueId: string) => {
    navigate(`/edit-venue/${venueId}`);
  };

  const sortedVenues = [...venues].sort((a, b) => {
    const dateA = new Date(a.created).getTime();
    const dateB = new Date(b.created).getTime();
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className={`${styles["manage-venues-content"]} ${className}`}>
        <div className={styles.loading}>Loading your venues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles["manage-venues-content"]} ${className}`}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={`${styles["manage-venues-content"]} ${className}`}>
      <div className={styles.header}>
        <Link to="/create-venue" className={styles["create-btn"]}>
          <FaPlus /> Create New Venue
        </Link>
      </div>

      {venues.length === 0 ? (
        <div className={styles["empty-state"]}>
          <h2>No Venues Yet</h2>
          <p>Start by creating your first venue to begin hosting guests.</p>
          <Link to="/create-venue" className={styles["create-btn"]}>
            <FaPlus /> Create Your First Venue
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.controls}>
            <div className={styles["sort-controls"]}>
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                className={styles["sort-select"]}
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest")
                }
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className={styles["venue-count"]}>
              {venues.length} venue{venues.length !== 1 ? "s" : ""}
            </div>
          </div>{" "}
          <div className={styles["venues-grid"]}>
            {sortedVenues.map((venue) => (
              <VenueManageCard
                key={venue.id}
                venue={venue}
                onEdit={handleEditVenue}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageVenuesContent;
