import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar"; // Corrected path
import Footer from "./components/footer/Footer"; // Corrected path

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
