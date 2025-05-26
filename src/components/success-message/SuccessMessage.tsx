import React from "react";
import styles from "./SuccessMessage.module.scss";

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div className={styles.successMessage}>
      <p>{message}</p>
    </div>
  );
};

export default SuccessMessage;
