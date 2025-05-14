import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/login/LoginForm";
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

        console.log("Logged in user:", response.data);
        alert("Login successful!"); // Replace with actual success handling later
        navigate("/profile"); // Redirect to profile page or dashboard
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
    </div>
  );
};

export default LoginPage;
