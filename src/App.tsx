import { Routes, Route } from "react-router-dom";
import "./App.scss";
// Import page components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VenuePage from "./pages/VenuePage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./Layout";

function App() {
  return (
    <Routes>
      {/* Wrap all page routes within the Layout component */}
      <Route path="/" element={<Layout />}>
        {/* Child routes rendered by Outlet in Layout */}
        <Route index element={<HomePage />} /> {/* index route for "/" */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="venue/:id" element={<VenuePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}
      </Route>
    </Routes>
  );
}

export default App;
