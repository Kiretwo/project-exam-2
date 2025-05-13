import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm, {
  RegisterStep1Data,
} from "../components/auth/register/RegisterForm";
import VenueManagerPrompt from "../components/auth/register/VenueManagerPrompt";
import { registerUser, UserRegistrationData } from "../api/auth/register";

const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<RegisterStep1Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStep1Submit = (data: RegisterStep1Data) => {
    console.log("Step 1 Data:", data);
    setStep1Data(data);
    setCurrentStep(2);
    setError(null); // Clear previous errors
  };

  const handleVenueManagerSelection = async (isVenueManager: boolean) => {
    if (!step1Data) {
      setError("Registration data is missing. Please start over.");
      setCurrentStep(1);
      return;
    }

    const finalRegistrationData: UserRegistrationData = {
      name: step1Data.name,
      email: step1Data.email,
      password: step1Data.password,
      venueManager: isVenueManager,
      // avatar: null, // Avatar can be added later or maybe include in step 1/2
    };

    setLoading(true);
    setError(null);

    try {
      const response = await registerUser(finalRegistrationData);
      console.log("Registered user:", response.data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      // Check for the specific "Profile already exists" error message
      if (err.message && err.message.includes("Profile already exists")) {
        setError(
          "This email address is already registered. Please use a different email or log in."
        );
        setCurrentStep(1); // Go back to step 1
      } else {
        setError(err.message || "Failed to register. Please try again.");
        setCurrentStep(1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {currentStep === 1 && (
        <RegisterForm
          onStep1Submit={handleStep1Submit}
          loading={loading}
          error={error}
        />
      )}
      {currentStep === 2 && (
        <VenueManagerPrompt
          onSelection={handleVenueManagerSelection}
          loading={loading}
        />
      )}
      {/* Add a button to go back to step 1 if needed */}
    </div>
  );
};

export default RegisterPage;
