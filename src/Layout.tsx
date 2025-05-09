import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar"; // Corrected path
import Footer from "./components/Footer"; // Corrected path

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet /> {/* Page content will be rendered here */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
