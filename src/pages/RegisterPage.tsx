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
    // Here you could do a preliminary validation or check if email exists, if API supports it
    // For now, just store data and move to step 2
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
      // avatar: null, // Avatar can be added later or if you want to include it in step 1/2
    };

    setLoading(true);
    setError(null);

    try {
      const response = await registerUser(finalRegistrationData);
      console.log("Registered user:", response.data); // Assuming response has a data property
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
      // Optionally, if API error is specific to step 1 data, you might want to revert to step 1
      // setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {currentStep === 1 && (
        <RegisterForm
          onStep1Submit={handleStep1Submit}
          loading={loading} // You might want separate loading states if step 1 involves an API call
          error={error}
        />
      )}
      {currentStep === 2 && (
        <VenueManagerPrompt
          onSelection={handleVenueManagerSelection}
          loading={loading}
        />
      )}
      {/* You could add a button to go back to step 1 if needed */}
    </div>
  );
};

export default RegisterPage;
