import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/login/LoginForm";
import SuccessMessage from "../components/success-message/SuccessMessage";
// Import interfaces and functions from the API module
import {
  loginUser,
  storeAccessToken,
  storeUserName,
  LoginCredentials,
  LoginApiResponse,
} from "../api/auth/login";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Use the LoginCredentials type for credentials
  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      // Use the LoginApiResponse type for the response
      const response: LoginApiResponse = await loginUser(credentials);

      // If API returns a token and user data
      if (response.data && response.data.accessToken) {
        // store token & userName
        storeAccessToken(response.data.accessToken);
        storeUserName(response.data.name);

        // Check and store venue manager status
        if (response.data.venueManager) {
          localStorage.setItem("isVenueManager", "true");
          console.log("User is a venue manager, setting localStorage");
        } else {
          localStorage.setItem("isVenueManager", "false");
          console.log("User is not a venue manager, setting localStorage");
        }
        console.log("Logged in user:", response.data);
        setShowSuccess(true);

        // Navigate after a delay to show the success message
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        throw new Error("Login failed: No access token received.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {/* Add a page-specific layout or heading here if needed */}
      <LoginForm onLogin={handleLogin} loading={loading} error={error} />

      {showSuccess && (
        <SuccessMessage message="Login successful! Redirecting to your profile..." />
      )}
    </div>
  );
};

export default LoginPage;
