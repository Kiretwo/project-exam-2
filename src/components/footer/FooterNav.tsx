import React from "react";
import { FaHome, FaSearch, FaCalendarAlt, FaUser } from "react-icons/fa";
import styles from "./FooterNav.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles["footer-nav"]}>
      <nav>
        <ul>
          <li className="active">
            <a href="#">
              <FaHome className="icon" />
              <span className="label">Home</span>
            </a>
          </li>
          <li>
            <a href="#">
              <FaSearch className="icon" />
              <span className="label">Search</span>
            </a>
          </li>
          <li>
            <a href="#">
              <FaCalendarAlt className="icon" />
              <span className="label">Bookings</span>
            </a>
          </li>
          <li>
            <a href="#">
              <FaUser className="icon" />
              <span className="label">Profile</span>
            </a>
          </li>
        </ul>
      </nav>
      {/* Desktop Footer */}
      {/*       <p>&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p> */}
    </footer>
  );
};

export default Footer;
