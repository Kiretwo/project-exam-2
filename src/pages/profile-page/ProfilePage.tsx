import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserEdit,
  FaSignOutAlt,
  FaHotel,
  FaTimes,
  FaSave,
  FaCamera,
  FaUserCheck,
} from "react-icons/fa";
import styles from "./ProfilePage.module.scss";
import { useProfileStore } from "../../stores/profileStore";
import ManageVenuesContent from "../../components/manage-venues/ManageVenuesContent";
import ReceivedBookings from "../../components/received-bookings/ReceivedBookings";
import ImageUrlModal from "../../components/image-url-modal/ImageUrlModal";

const ProfilePage: React.FC = () => {
  const location = useLocation();
  const {
    profile,
    isVenueManager,
    loading,
    error,
    fetchProfile,
    toggleVenueManager,
    successMessage,
    clearMessage,
    venuesWithBookings,
    receivedBookingsLoading,
    receivedBookingsError,
    fetchReceivedBookings,
    // Edit mode state and functions
    isEditMode,
    editProfile,
    updateLoading,
    showImageModal,
    imageModalType,
    setEditMode,
    updateEditProfile,
    updateProfile,
    showImageUrlModal,
    hideImageModal,
  } = useProfileStore();
  const [activeTab, setActiveTab] = useState("manageVenues"); // Set initial venue manager status in localStorage on load

  // Set Manage Venues tab active if redirected after deletion
  useEffect(() => {
    if (location.state && location.state.showManageVenues) {
      setActiveTab("manageVenues");
    }
  }, [location.state]);

  useEffect(() => {
    // Check if we should navigate to a specific tab
    const targetTab = sessionStorage.getItem("profileActiveTab");
    if (targetTab) {
      setActiveTab(targetTab);
      sessionStorage.removeItem("profileActiveTab"); // Clear after using
    }
  }, []);

  useEffect(() => {
/*     console.log("ProfilePage mounted, isVenueManager:", isVenueManager);
    console.log(
      "localStorage isVenueManager:",
      localStorage.getItem("isVenueManager")
    ); */
    fetchProfile();

    // Add console logging for debugging
/*     console.log(
      "ProfilePage mounted, current isVenueManager state:",
      isVenueManager
    );
    console.log(
      "localStorage isVenueManager value:",
      localStorage.getItem("isVenueManager")
    ); */
  }, [fetchProfile]);

  // Fetch received bookings when component mounts if user is a venue manager
  useEffect(() => {
    if (isVenueManager) {
      fetchReceivedBookings();
    }
  }, [isVenueManager, fetchReceivedBookings]); // Update localStorage when isVenueManager changes
  useEffect(() => {
    // This ensures the HeaderNav component can check if user is a venue manager
    const currentStatus = String(!!isVenueManager);
    const storedStatus = localStorage.getItem("isVenueManager");

/*     console.log("ProfilePage: isVenueManager changed to", isVenueManager);
    console.log("Current localStorage value:", storedStatus); */

    if (currentStatus !== storedStatus) {
/*       console.log(
        "Updating localStorage with new isVenueManager:",
        currentStatus
      ); */
      localStorage.setItem("isVenueManager", currentStatus);

      // Dispatch custom event
      const venueManagerEvent = new CustomEvent("venueManagerStatusChanged", {
        detail: { isVenueManager: !!isVenueManager },
      });
      window.dispatchEvent(venueManagerEvent);
    }
  }, [isVenueManager]);
  const handleToggle = async () => {
    // Call the toggle function from the store
    await toggleVenueManager();
    // Clear success message after a delay
    setTimeout(clearMessage, 3000);
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("isVenueManager");
    window.location.href = "/login";
  };
  if (loading) {
    return (
      <div className={styles["profile-page"]}>
        <div className={styles.profileHero}>
          <div className={styles.bannerPlaceholder}></div>
          <div className="container">
            <div className={styles.loadingState}>
              <div className={styles.loadingAvatar}></div>
              <div className={styles.loadingText}></div>
              <div className={styles.loadingText}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError =
      error.includes("No user found") || error.includes("log in");

    return (
      <div className={styles["profile-page"]}>
        <div className={styles.profileHero}>
          <div className={styles.bannerPlaceholder}></div>
          <div className="container">
            <p className={styles.error}>
              {isAuthError ? "Authentication required" : error}
            </p>
          </div>
        </div>

        {/* Content area for authentication prompt */}
        {isAuthError && (
          <div className={styles.contentWrapper}>
            <div className="container">
              <div className={styles.authPrompt}>
                <h2>You need to log in to view your profile</h2>
                <div className={styles.authLinks}>
                  <Link to="/login" className={styles.loginBtn}>
                    Log In
                  </Link>
                  <p className={styles.registerPrompt}>
                    Don't have an account?{" "}
                    <Link to="/register" className={styles.registerLink}>
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={styles["profile-page"]}>
      {/* Profile hero section with blue background */}
      <div className={styles.profileHero}>
        {/* Banner section - now inside the hero section */}
        {isEditMode ? (
          <div className={styles.editBanner}>
            <div
              className={
                profile.banner ? styles.banner : styles.bannerPlaceholder
              }
              style={
                profile.banner
                  ? { backgroundImage: `url(${editProfile.banner})` }
                  : {}
              }
            >
              <button
                className={styles.editOverlay}
                onClick={() => showImageUrlModal("banner")}
              >
                <FaCamera />
                <span>Change Banner</span>
              </button>
            </div>
          </div>
        ) : profile.banner ? (
          <div
            className={styles.banner}
            style={{ backgroundImage: `url(${profile.banner})` }}
          />
        ) : (
          <div className={styles.bannerPlaceholder}></div>
        )}
        {successMessage && (
          <div className={styles.success}>{successMessage}</div>
        )}
        {/* Profile header with avatar and details */}
        <div className="container">
          <div className={styles.header}>
            {isEditMode ? (
              <div className={styles.editAvatarContainer}>
                <img
                  src={
                    editProfile.avatar ||
                    "/images/profile-picture-placeholder.jpg"
                  }
                  alt="Profile avatar"
                  className={styles.avatar}
                />
                <button
                  className={styles.editAvatarOverlay}
                  onClick={() => showImageUrlModal("avatar")}
                >
                  <FaCamera />
                </button>
              </div>
            ) : (
              <div className={styles.avatarContainer}>
                <img
                  src={
                    profile.avatar || "/images/profile-picture-placeholder.jpg"
                  }
                  alt="Profile avatar"
                  className={styles.avatar}
                />
              </div>
            )}
            <div className={styles.info}>
              <div className={styles.headerButtons}>
                <button className={styles.logout} onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
              <h2 className={styles.name}>{profile.name}</h2>
              <p className={styles.email}>{profile.email}</p>
              {isEditMode ? (
                <div className={styles.editBio}>
                  <textarea
                    value={editProfile.bio}
                    onChange={(e) => updateEditProfile("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    className={styles.bioInput}
                    rows={3}
                  />
                </div>
              ) : (
                profile.bio && <p className={styles.bio}>{profile.bio}</p>
              )}
              <div className={styles.actions}>
                {isEditMode ? (
                  <button
                    className={`${styles.actionBtn} ${styles.saveBtn}`}
                    onClick={updateProfile}
                    disabled={updateLoading}
                  >
                    <FaSave /> {updateLoading ? "Saving..." : "Save Changes"}
                  </button>
                ) : (
                  <button
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    onClick={() => setEditMode(true)}
                  >
                    <FaUserEdit /> Edit Profile
                  </button>
                )}
                <button
                  className={`${styles.actionBtn} ${styles.venueBtn} ${
                    isVenueManager ? styles.active : ""
                  }`}
                  onClick={handleToggle}
                >
                  {isVenueManager ? (
                    <>
                      <span className={styles.defaultText}>
                        <FaUserCheck /> Venue Manager
                      </span>
                      <span className={styles.hoverText}>
                        <FaTimes /> Remove?
                      </span>
                    </>
                  ) : (
                    <>
                      <FaHotel /> Become a venue manager
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation tabs - simple text links with underline when active */}{" "}
        <div className={styles.navTabs}>
          <div className={styles.tabsContainer}>
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
            {isVenueManager && (
              <div
                className={`${styles.tab} ${
                  activeTab === "receivedBookings" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("receivedBookings");
                  // Refresh received bookings when switching to this tab
                  if (isVenueManager) {
                    fetchReceivedBookings();
                  }
                }}
              >
                Received Bookings
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image URL Modal */}
      <ImageUrlModal
        isOpen={showImageModal}
        type={imageModalType || "avatar"}
        currentUrl={
          imageModalType === "banner"
            ? editProfile.banner || ""
            : editProfile.avatar
        }
        onSave={(url) => {
          if (imageModalType === "banner") {
            updateEditProfile("banner", url);
          } else {
            updateEditProfile("avatar", url);
          }
        }}
        onCancel={hideImageModal}
      />

      {/* Tab content - rendered based on active tab - Now OUTSIDE the blue background */}
      <div className={styles.contentWrapper}>
        <div className="container">
          <div className={styles.contentSection}>
            {!isVenueManager && (
              <div className={styles.emptyState}>
                <h3>Welcome to Your Profile</h3>
                <p>
                  Become a venue manager to access advanced features like
                  managing venues and viewing received bookings.
                </p>
              </div>
            )}
            {activeTab === "manageVenues" && isVenueManager && (
              <ManageVenuesContent />
            )}
            {activeTab === "receivedBookings" && isVenueManager && (
              <ReceivedBookings
                venuesWithBookings={venuesWithBookings}
                loading={receivedBookingsLoading}
                error={receivedBookingsError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
