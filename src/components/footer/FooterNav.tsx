import React from "react";
import { NavLink } from "react-router-dom";
import { FaSearch, FaCalendarAlt, FaUser } from "react-icons/fa";
import styles from "./FooterNav.module.scss";

const Footer: React.FC = () => {
  return (
    <>
      {/* Mobile Navigation Footer - visible on small/medium screens */}
      <footer className={styles["footer-nav"]}>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `${styles.link} ${styles["home-btn"]} ${
                    isActive ? styles.active : ""
                  }`
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

      {/* Desktop Footer - visible on large screens */}
      <footer className={styles["desktop-footer"]}>
        <div className={styles["footer-content"]}>
          <div className={styles["footer-section"]}>
            <h3 className={styles["footer-title"]}>Holidaze</h3>
            <p className={styles["footer-description"]}>
              Your perfect accommodation awaits. Book venues and create
              unforgettable experiences.
            </p>
          </div>

          <div className={styles["footer-section"]}>
            <h4 className={styles["section-title"]}>Quick Links</h4>
            <ul className={styles["footer-links"]}>
              <li>
                <NavLink to="/" className={styles["footer-link"]}>
                  Search Venues
                </NavLink>
              </li>
              <li>
                <NavLink to="/bookings" className={styles["footer-link"]}>
                  My Bookings
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={styles["footer-link"]}>
                  Profile
                </NavLink>
              </li>
            </ul>
          </div>

          <div className={styles["footer-section"]}>
            <h4 className={styles["section-title"]}>For Hosts</h4>
            <ul className={styles["footer-links"]}>
              <li>
                <NavLink to="/create-venue" className={styles["footer-link"]}>
                  List Your Venue
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={styles["footer-link"]}>
                  Manage Venues
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles["footer-bottom"]}>
          <p className={styles["copyright"]}>
            © 2025 Holidaze. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
