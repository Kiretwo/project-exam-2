import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./LoginForm.module.scss";

interface LoginFormProps {
  onLogin: (data: any) => void; // Replace 'any' with actual login data type
  loading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Clear previous form errors
    setFormErrors({});

    // Validate form
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onLogin({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <h2>Login</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}{" "}
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={formErrors.email ? styles.inputError : ""}
          aria-invalid={!!formErrors.email}
          aria-describedby={formErrors.email ? "email-error" : undefined}
        />
        {formErrors.email && (
          <p id="email-error" className={styles.errorMessage}>
            {formErrors.email}
          </p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={formErrors.password ? styles.inputError : ""}
          aria-invalid={!!formErrors.password}
          aria-describedby={formErrors.password ? "password-error" : undefined}
        />
        {formErrors.password && (
          <p id="password-error" className={styles.errorMessage}>
            {formErrors.password}
          </p>
        )}
      </div>
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className={styles.authPrompt}>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className={styles.authLink}>
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
