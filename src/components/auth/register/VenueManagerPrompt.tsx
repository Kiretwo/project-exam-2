import React from "react";
import styles from "./VenueManagerPrompt.module.scss";

interface VenueManagerPromptProps {
  onSelection: (isVenueManager: boolean) => void;
  onGoBack: () => void;
  loading: boolean;
}

const VenueManagerPrompt: React.FC<VenueManagerPromptProps> = ({
  onSelection,
  onGoBack,
  loading,
}) => {
  return (
    <div className={styles.promptContainer}>
      <h2>One Last Step...</h2>
      <p>Do you want to register as a venue manager?</p>
      <p>As a venue manager, you can list and manage your own venues.</p>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => onSelection(true)}
          disabled={loading}
          className={`${styles.button} ${styles.yesButton}`}
        >
          Yes, I'm a Venue Manager
        </button>
        <button
          onClick={() => onSelection(false)}
          disabled={loading}
          className={`${styles.button} ${styles.noButton}`}
        >
          No, Continue as Customer
        </button>
      </div>

      <div className={styles.backLink}>
        <button
          onClick={onGoBack}
          disabled={loading}
          className={styles.goBackButton}
        >
          ← Go back to edit registration details
        </button>
      </div>
    </div>
  );
};

export default VenueManagerPrompt;
