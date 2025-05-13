import React, { useState } from "react";
import styles from "./RegisterForm.module.scss";

// Define the shape of the data for step 1
export interface RegisterStep1Data {
  name: string;
  email: string;
  password: string;
  // Avatar can be added later, perhaps in profile management
}

interface RegisterFormProps {
  onStep1Submit: (data: RegisterStep1Data) => void;
  loading: boolean;
  error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onStep1Submit,
  loading,
  error,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    // Email validation for @stud.noroff.no
    if (!email.endsWith("@stud.noroff.no")) {
      alert(
        "Registration is only allowed with a @stud.noroff.no email address."
      );
      return;
    }

    // Password length validation (minimum 8 characters)
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    onStep1Submit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <h2>Register - Step 1 of 2</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.formGroup}>
        <label htmlFor="name">Name*</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email*</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password*</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password*</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? "Processing..." : "Next Step"}
      </button>
    </form>
  );
};

export default RegisterForm;
