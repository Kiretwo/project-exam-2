import React, { useState } from "react";
import { FaTimes, FaImage } from "react-icons/fa";
import styles from "./ImageUrlModal.module.scss";

interface ImageUrlModalProps {
  isOpen: boolean;
  type: "avatar" | "banner";
  currentUrl: string;
  onSave: (url: string) => void;
  onCancel: () => void;
}

const ImageUrlModal: React.FC<ImageUrlModalProps> = ({
  isOpen,
  type,
  currentUrl,
  onSave,
  onCancel,
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [isValidImage, setIsValidImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (newUrl.trim()) {
      setIsLoading(true);
      const img = new Image();
      img.onload = () => {
        setIsValidImage(true);
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsValidImage(false);
        setIsLoading(false);
      };
      img.src = newUrl;
    } else {
      setIsValidImage(false);
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    onSave(url.trim());
    onCancel();
  };

  const handleRemove = () => {
    onSave("");
    onCancel();
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>
            <FaImage /> Change{" "}
            {type === "avatar" ? "Profile Picture" : "Banner Image"}
          </h3>
          <button className={styles.closeBtn} onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.inputGroup}>
            <label htmlFor="imageUrl">Image URL:</label>
            <input
              id="imageUrl"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder={`Enter ${type} image URL...`}
              className={styles.urlInput}
            />
          </div>

          {url && (
            <div className={styles.preview}>
              <label>Preview:</label>
              {isLoading ? (
                <div className={styles.loading}>Loading preview...</div>
              ) : isValidImage ? (
                <div
                  className={`${styles.previewImage} ${
                    type === "banner"
                      ? styles.bannerPreview
                      : styles.avatarPreview
                  }`}
                  style={{ backgroundImage: `url(${url})` }}
                />
              ) : (
                <div className={styles.invalidImage}>
                  <FaTimes /> Invalid image URL
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.removeBtn}
            onClick={handleRemove}
            disabled={!currentUrl}
          >
            Remove {type === "avatar" ? "Picture" : "Banner"}
          </button>
          <div className={styles.primaryActions}>
            <button className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={url.trim() !== "" && !isValidImage}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUrlModal;
