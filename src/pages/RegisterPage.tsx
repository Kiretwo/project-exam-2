import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm, {
  RegisterStep1Data,
} from "../components/auth/register/RegisterForm";
import VenueManagerPrompt from "../components/auth/register/VenueManagerPrompt";
import SuccessMessage from "../components/success-message/SuccessMessage";
import { registerUser, UserRegistrationData } from "../api/auth/register";

const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<RegisterStep1Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
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
      setShowSuccess(true);

      // Navigate after a delay to show the success message
      setTimeout(() => {
        navigate("/login");
      }, 2500);
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

  const handleGoBackToStep1 = () => {
    setCurrentStep(1);
    setError(null); // Clear any errors
  };
  return (
    <div>
      {currentStep === 1 && (
        <RegisterForm
          onStep1Submit={handleStep1Submit}
          loading={loading}
          error={error}
          initialValues={step1Data || undefined}
        />
      )}
      {currentStep === 2 && (
        <VenueManagerPrompt
          onSelection={handleVenueManagerSelection}
          onGoBack={handleGoBackToStep1}
          loading={loading}
        />
      )}
      {showSuccess && (
        <SuccessMessage message="Registration successful! Redirecting to login page..." />
      )}
    </div>
  );
};

export default RegisterPage;
