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
    // Check if user is a venue manager from localStorage or somewhere else
    const userIsVenueManager =
      localStorage.getItem("isVenueManager") === "true";
    setIsVenueManager(userIsVenueManager);
  }, [location]);

  const isLoggedIn = !!userName;

  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-brand"]}>
        <Link to="/">Holidaze</Link>
      </div>

      <ul className={styles["navbar-links"]}>
        {isLoggedIn && isVenueManager && (
          <li>
            <Link to="/create-venue" className={styles["create-venue-btn"]}>
              <FaPlus /> Create venue
            </Link>
          </li>
        )}
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
    </nav>
  );
};

export default Navbar;
