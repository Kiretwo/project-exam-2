import React from "react";
import { FaHome, FaSearch, FaCalendarAlt, FaUser } from "react-icons/fa";
import styles from "./FooterNav.module.scss";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className={styles["footer-nav"]}>
      <nav>
        <ul>
          <li className={styles["home-btn"]}>
            <Link to="/">
              <FaHome className={`${styles.icon} ${styles["icon-home"]}`} />
              <span className="label">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/search">
              <FaSearch className={styles.icon} />
              <span className="label">Search</span>
            </Link>
          </li>
          <li>
            <Link to="/bookings">
              <FaCalendarAlt className={styles.icon} />
              <span className="label">Bookings</span>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <FaUser className={styles.icon} />
              <span className="label">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
      {/* Desktop Footer */}
      {/*       <p>&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p> */}
    </footer>
  );
};

export default Footer;
