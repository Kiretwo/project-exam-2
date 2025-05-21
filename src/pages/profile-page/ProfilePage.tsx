import React, { useEffect } from "react";
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

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleToggle = () => {
    toggleVenueManager();
    setTimeout(clearMessage, 3000);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles["profile-page"]}>
      <div
        className={styles.banner}
        style={
          profile.banner
            ? { backgroundImage: `url(${profile.banner})` }
            : undefined
        }
      />

      <div className="container">
        <h1 className={styles.title}>Profile</h1>

        {successMessage && (
          <div className={styles.success}>{successMessage}</div>
        )}

        <div className={styles.header}>
          {" "}
          <img
            src={profile.avatar || "/images/profile-picture-placeholder.jpg"}
            alt="Profile avatar"
            className={styles.avatar}
          />
          <div className={styles.info}>
            <h2 className={styles.name}>{profile.name}</h2>
            <p className={styles.bio}>{profile.bio}</p>
          </div>{" "}
          <button
            className={
              isVenueManager
                ? `${styles.venueBtn} ${styles["remove-hover"]}`
                : styles.venueBtn
            }
            onClick={handleToggle}
          >
            {isVenueManager ? "Venue Manager" : "Become a venue manager"}
          </button>{" "}
        </div>

        {isVenueManager && <div className={styles.adminSection}></div>}
      </div>
    </div>
  );
};

export default ProfilePage;
