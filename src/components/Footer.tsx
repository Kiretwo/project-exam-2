import React from "react";
import "./Footer.scss"; // We'll create this next

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
