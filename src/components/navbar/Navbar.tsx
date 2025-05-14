import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-brand"]}>
        <Link to="/">Holidaze</Link>
      </div>
      <ul className={styles["navbar-links"]}>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>{" "}
        {/* Will need conditional logic later */}
        <li>
          <Link to="/login">Login</Link>
        </li>{" "}
        {/* Will need conditional logic later */}
        <li>
          <Link to="/register">Register</Link>
        </li>{" "}
        {/* Will need conditional logic later */}
      </ul>
    </nav>
  );
};

export default Navbar;
