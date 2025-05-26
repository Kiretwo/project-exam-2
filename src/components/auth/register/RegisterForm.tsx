import React, { useState, ChangeEvent, FormEvent } from "react"; // Added ChangeEvent, FormEvent
import { Link } from "react-router-dom";
import styles from "./RegisterForm.module.scss";

// Define the shape of the data for step 1
export interface RegisterStep1Data {
  name: string;
  email: string;
  password: string;
}

interface RegisterFormProps {
  onStep1Submit: (data: RegisterStep1Data) => void;
  loading: boolean;
  error: string | null; // This is for API errors, we'll add local form errors
  initialValues?: RegisterStep1Data; // Optional initial values for preserving data
}

// Define a type for our form errors
interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string; // For errors not specific to a field
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onStep1Submit,
  loading,
  error: apiError, // Renamed to avoid conflict with local errors state
  initialValues,
}) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [password, setPassword] = useState(initialValues?.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateField = (
    fieldName: string,
    value: string
  ): string | undefined => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) return "Name is required.";
        // Add other name specific validations if needed (e.g. no punctuation)
        if (/[^a-zA-Z0-9_]/.test(value))
          return "Name can only contain letters, numbers, and underscores.";
        return undefined;
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!value.endsWith("@stud.noroff.no"))
          return "Email must be a @stud.noroff.no address.";
        return undefined;
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 8) return "Password must be at least 8 characters.";
        return undefined;
      case "confirmPassword":
        if (!value) return "Confirm password is required.";
        if (value !== password) return "Passwords do not match.";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { name, value } = e.target;
    setter(value);
    // Validate on change and clear error for that field if valid
    const error = validateField(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
      general: undefined, // Clear general error on any input change
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    // Changed to FormEvent
    event.preventDefault();
    setFormErrors({}); // Clear previous errors

    const currentErrors: FormErrors = {};
    const nameError = validateField("name", name);
    if (nameError) currentErrors.name = nameError;

    const emailError = validateField("email", email);
    if (emailError) currentErrors.email = emailError;

    const passwordError = validateField("password", password);
    if (passwordError) currentErrors.password = passwordError;

    const confirmPasswordError = validateField(
      "confirmPassword",
      confirmPassword
    );
    if (confirmPasswordError)
      currentErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(currentErrors).length > 0) {
      setFormErrors(currentErrors);
      return;
    }

    onStep1Submit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <h2>Register - Step 1 of 2</h2>
      {/* Display API error if it exists */}
      {apiError && <p className={styles.errorMessageItem}>{apiError}</p>}
      {/* Display general form error if it exists */}
      {formErrors.general && (
        <p className={styles.errorMessageItem}>{formErrors.general}</p>
      )}
      <div className={styles.formGroup}>
        <label htmlFor="name">Name*</label>
        <input
          type="text"
          id="name"
          name="name" // Added name attribute for validation
          value={name}
          onChange={(e) => handleInputChange(e, setName)}
          className={formErrors.name ? styles.inputError : ""}
          aria-invalid={!!formErrors.name}
          aria-describedby={formErrors.name ? "name-error" : undefined}
        />
        {formErrors.name && (
          <p id="name-error" className={styles.errorMessageItem}>
            {formErrors.name}
          </p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email*</label>
        <input
          type="email"
          id="email"
          name="email" // Added name attribute
          value={email}
          onChange={(e) => handleInputChange(e, setEmail)}
          className={formErrors.email ? styles.inputError : ""}
          aria-invalid={!!formErrors.email}
          aria-describedby={formErrors.email ? "email-error" : undefined}
        />
        {formErrors.email && (
          <p id="email-error" className={styles.errorMessageItem}>
            {formErrors.email}
          </p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password*</label>
        <input
          type="password"
          id="password"
          name="password" // Added name attribute
          value={password}
          onChange={(e) => handleInputChange(e, setPassword)}
          className={formErrors.password ? styles.inputError : ""}
          aria-invalid={!!formErrors.password}
          aria-describedby={formErrors.password ? "password-error" : undefined}
        />
        {formErrors.password && (
          <p id="password-error" className={styles.errorMessageItem}>
            {formErrors.password}
          </p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password*</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword" // Added name attribute
          value={confirmPassword}
          onChange={(e) => handleInputChange(e, setConfirmPassword)}
          className={formErrors.confirmPassword ? styles.inputError : ""}
          aria-invalid={!!formErrors.confirmPassword}
          aria-describedby={
            formErrors.confirmPassword ? "confirmPassword-error" : undefined
          }
        />
        {formErrors.confirmPassword && (
          <p id="confirmPassword-error" className={styles.errorMessageItem}>
            {formErrors.confirmPassword}
          </p>
        )}
      </div>{" "}
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? "Processing..." : "Next Step"}
      </button>
      <div className={styles.authPrompt}>
        <p>
          Already have an account?{" "}
          <Link to="/login" className={styles.authLink}>
            Login here
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
