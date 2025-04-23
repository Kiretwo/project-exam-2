import { Routes, Route } from "react-router-dom";
import "./App.scss";
// Import page components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VenuePage from "./pages/VenuePage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      {/* We can add a Layout component here later (e.g., Navbar, Footer) */}
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/venue/:id" element={<VenuePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}
      </Routes>
    </>
  );
}

export default App;
