import { Routes, Route } from "react-router-dom";
import "./App.scss";
// Import page components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/profile-page/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./Layout";
import SearchPage from "./pages/search-page/SearchPage";
import VenueDetail from "./pages/venue-detail/VenueDetail";
import BookingPage from "./pages/booking-page/BookingPage";
import CreateVenuePage from "./pages/create-venue/CreateVenuePage";
import EditVenuePage from "./pages/edit-venue/EditVenuePage";

function App() {
  return (
    <Routes>
      {/* Wrap all page routes within the Layout component */}
      <Route path="/" element={<Layout />}>
        {/* Child routes rendered by Outlet in Layout */}
        <Route index element={<HomePage />} /> {/* index route for "/" */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />{" "}
        <Route path="search" element={<SearchPage />} />
        <Route path="bookings" element={<BookingPage />} />{" "}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="create-venue" element={<CreateVenuePage />} />
        <Route path="edit-venue/:id" element={<EditVenuePage />} />
        <Route path="venues/:id" element={<VenueDetail />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}
      </Route>
    </Routes>
  );
}

export default App;
