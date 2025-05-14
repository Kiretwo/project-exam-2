import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaSearch, FaCalendarAlt, FaUser } from "react-icons/fa";
import styles from "./FooterNav.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles["footer-nav"]}>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${styles.link} ${styles["home-btn"]} ${isActive ? styles.active : ""}`
              }
            >
              <FaHome className={`${styles.icon} ${styles["icon-home"]}`} />
              <span className={styles.label}>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <FaSearch className={styles.icon} />
              <span className={styles.label}>Search</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <FaCalendarAlt className={styles.icon} />
              <span className={styles.label}>Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <FaUser className={styles.icon} />
              <span className={styles.label}>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
