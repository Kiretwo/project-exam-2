import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss"; // We'll create this next

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Holidaze</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Venues</Link>
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
