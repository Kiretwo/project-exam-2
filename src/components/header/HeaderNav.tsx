import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { getUserName } from "../../api/auth/login";
import styles from "./HeaderNav.module.scss";

const Navbar: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const name = getUserName();
    setUserName(name);

    // Check if user is a venue manager from localStorage and update immediately
    const userIsVenueManager =
      localStorage.getItem("isVenueManager") === "true";
/*     console.log(
      "HeaderNav: userName =",
      name,
      "isVenueManager =",
      userIsVenueManager
    ); */
    setIsVenueManager(userIsVenueManager);
    // Add event listeners for both storage and custom events
    const handleStorageChange = () => {
      const updatedStatus = localStorage.getItem("isVenueManager") === "true";
      console.log(
        "HeaderNav: Storage changed, isVenueManager =",
        updatedStatus
      );
      setIsVenueManager(updatedStatus);
    };

    const handleVenueManagerChange = (event: any) => {
      const { isVenueManager: newStatus } = event.detail;
      console.log("HeaderNav: Custom venue manager event received:", newStatus);
      setIsVenueManager(newStatus);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "venueManagerStatusChanged",
      handleVenueManagerChange
    );

    // Cleanup listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "venueManagerStatusChanged",
        handleVenueManagerChange
      );
    };
  }, [location]);

  const isLoggedIn = !!userName;
  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-brand"]}>
        <Link to="/">Holidaze</Link>
      </div>

      <div className={styles.navbarActions}>
        {isLoggedIn && isVenueManager && (
          <Link to="/create-venue" className={styles["create-venue-btn"]}>
            <FaPlus /> Create venue
          </Link>
        )}

        <ul className={styles["navbar-links"]}>
          <li>
            <Link to="/search">Search</Link>
          </li>
          {isLoggedIn ? (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
