import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import styles from "./ProfilePage.module.scss";
import { useProfileStore } from "../../stores/profileStore";

const ProfilePage: React.FC = () => {
  const {
    profile,
    isVenueManager,
    loading,
    error,
    fetchProfile,
    toggleVenueManager,
    successMessage,
    clearMessage,
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState("myVenues"); // Set initial venue manager status in localStorage on load
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update localStorage when isVenueManager changes
  useEffect(() => {
    // This ensures the HeaderNav component can check if user is a venue manager
    localStorage.setItem("isVenueManager", String(!!isVenueManager));
  }, [isVenueManager]);
  const handleToggle = async () => {
    await toggleVenueManager();
    // Store venue manager status in localStorage for the header component to use
    // Use the opposite of current isVenueManager since it hasn't updated in state yet
    const newStatus = !isVenueManager;
    localStorage.setItem("isVenueManager", String(newStatus));
    setTimeout(clearMessage, 3000);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };
  if (loading) {
    return (
      <div className={styles["profile-page"]}>
        <div className="container">
          <div className={styles.loadingState}>
            <div className={styles.loadingAvatar}></div>
            <div className={styles.loadingText}></div>
            <div className={styles.loadingText}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["profile-page"]}>
        <div className="container">
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={styles["profile-page"]}>
      {" "}
      {/* Banner section - only shown if user has one */}
      {profile.banner ? (
        <div
          className={styles.banner}
          style={{ backgroundImage: `url(${profile.banner})` }}
        />
      ) : null}
      {/* Logout button */}
      <button className={styles.logout} onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>{" "}
      <div className="container">
        {successMessage && (
          <div className={styles.success}>{successMessage}</div>
        )}
      </div>
      {/* Profile header with avatar and details */}
      <div className="container">
        <div className={styles.header}>
          <div className={styles.avatarContainer}>
            <img
              src={profile.avatar || "/images/profile-picture-placeholder.jpg"}
              alt="Profile avatar"
              className={styles.avatar}
            />
          </div>
          <div className={styles.info}>
            <h2 className={styles.name}>{profile.name}</h2>
            <p className={styles.email}>{localStorage.getItem("userName")}</p>
            {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
          </div>
        </div>

        <div className={styles.actions}>
          <Link
            to="/edit-profile"
            className={`${styles.actionBtn} ${styles.editBtn}`}
          >
            <FaUserEdit /> Edit Profile
          </Link>
          <button
            className={`${styles.actionBtn} ${styles.venueBtn} ${
              isVenueManager ? styles.active : ""
            }`}
            onClick={handleToggle}
          >
            Venue Manager
          </button>
        </div>
      </div>{" "}
      {/* Navigation tabs */}
      <div className={styles.navTabs}>
        <div className="container">
          <div className={styles.tabsContainer}>
            <div
              className={`${styles.tab} ${
                activeTab === "myVenues" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("myVenues")}
            >
              My Venues
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "nextTrip" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("nextTrip")}
            >
              Next Trip
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "receivedBookings" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("receivedBookings")}
            >
              Received Bookings
            </div>
            {isVenueManager && (
              <div
                className={`${styles.tab} ${
                  activeTab === "manageVenues" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("manageVenues")}
              >
                Manage Venues
              </div>
            )}
          </div>
        </div>
      </div>{" "}
      {/* Tab content - rendered based on active tab */}
      <div className="container">
        <div className={styles.contentSection}>
          {activeTab === "myVenues" && (
            <div className={styles.venuesList}>My Venues Content</div>
          )}
          {activeTab === "nextTrip" && (
            <div className={styles.tripContent}>Next Trip Content</div>
          )}
          {activeTab === "receivedBookings" && (
            <div className={styles.bookingsList}>Received Bookings Content</div>
          )}
          {activeTab === "manageVenues" && (
            <div className={styles.manageContent}>Manage Venues Content</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
