import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserName } from "../../api/auth/login";
import styles from "./HeaderNav.module.scss";

const Navbar: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    setName(getUserName());
  }, [location]);

  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-brand"]}>
        <Link to="/">Holidaze</Link>
{/*         {name && (
          <span className={styles["navbar-welcome"]}>
            Welcome, {name}.
          </span>
        )} */}
      </div>

      <ul className={styles["navbar-links"]}>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
