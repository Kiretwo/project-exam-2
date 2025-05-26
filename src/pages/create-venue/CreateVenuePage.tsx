import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_VENUES } from "../../api/constants";
import { headers } from "../../api/headers";
import { isValidImageUrl, validateVenueForm } from "../../utils/validation";
import styles from "./CreateVenuePage.module.scss";

interface VenueData {
  name: string;
  description: string;
  media: { url: string; alt: string }[];
  price: number;
  maxGuests: number;
  rating: number;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
    lat: number;
    lng: number;
  };
}

interface ImagePreview {
  url: string;
  alt: string;
  id: string; // for easier removal
}

const CreateVenuePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Form state
  const [formData, setFormData] = useState<VenueData>({
    name: "",
    description: "",
    media: [],
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  // Display values for form inputs (empty strings for better UX)
  const [displayValues, setDisplayValues] = useState({
    price: "",
    rating: "",
    lat: "",
    lng: "",
    maxGuests: "",
  });

  // Image handling
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const addImage = () => {
    if (!imageUrl.trim()) return;

    // Validate image URL
    if (!isValidImageUrl(imageUrl.trim())) {
      setError("Please enter a valid image URL");
      return;
    }

    const newImage: ImagePreview = {
      url: imageUrl.trim(),
      alt: imageAlt.trim() || formData.name,
      id: Date.now().toString(),
    };

    setImagePreviews([...imagePreviews, newImage]);
    setImageUrl("");
    setImageAlt("");
    setError(null); // Clear any previous errors
  };

  const removeImage = (id: string) => {
    setImagePreviews(imagePreviews.filter((img) => img.id !== id));
  };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith("meta.")) {
        const metaKey = name.split(".")[1] as keyof VenueData["meta"];
        setFormData((prev) => ({
          ...prev,
          meta: { ...prev.meta, [metaKey]: checked },
        }));
      }
    } else if (name.startsWith("location.")) {
      const locationKey = name.split(".")[1] as keyof VenueData["location"];

      if (locationKey === "lat" || locationKey === "lng") {
        // Update display value for coordinates
        setDisplayValues((prev) => ({ ...prev, [locationKey]: value }));
        const parsedValue = parseFloat(value) || 0;
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, [locationKey]: parsedValue },
        }));
      } else {
        // Regular string location fields
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, [locationKey]: value },
        }));
      }
    } else {
      // Handle other fields
      if (name === "price" || name === "rating" || name === "maxGuests") {
        // Update display value for these numeric fields
        setDisplayValues((prev) => ({ ...prev, [name]: value }));
        const parsedValue = parseFloat(value) || 0;
        setFormData((prev) => ({ ...prev, [name]: parsedValue }));
      } else {
        const parsedValue = type === "number" ? parseFloat(value) || 0 : value;
        setFormData((prev) => ({ ...prev, [name]: parsedValue }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare venue data
      const venueData = {
        ...formData,
        media: imagePreviews.map((img) => ({ url: img.url, alt: img.alt })),
      }; // Validate required fields
      const validationErrors = validateVenueForm({
        name: venueData.name,
        description: venueData.description,
        price: venueData.price,
        maxGuests: venueData.maxGuests,
      });

      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }

      console.log("Creating venue:", venueData);

      const response = await fetch(API_VENUES, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(venueData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.errors?.[0]?.message || `HTTP ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Venue created:", result);

      setSuccess("Venue created successfully!");

      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/venues/${result.data.id}`);
      }, 2000);
    } catch (err: any) {
      console.error("Error creating venue:", err);
      setError(err.message || "Failed to create venue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["create-venue-page"]}>
      <div className="container">
        <h1>Create New Venue</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Information */}
          <section className={styles.section}>
            <h2>Basic Information</h2>
            <div className={styles.field}>
              <label htmlFor="name">Venue Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter venue name"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describe your venue..."
              />
            </div>{" "}
            <div className={styles["field-row"]}>
              {" "}
              <div className={styles.field}>
                <label htmlFor="price">Price per night (NOK) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={displayValues.price}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="500"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="maxGuests">Max Guests *</label>
                <input
                  type="number"
                  id="maxGuests"
                  name="maxGuests"
                  value={displayValues.maxGuests}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="20"
                  placeholder="1"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="rating">Rating (0-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={displayValues.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
            </div>
          </section>
          {/* Images */}
          <section className={styles.section}>
            <h2>Images</h2>{" "}
            <div className={styles["image-upload"]}>
              <div className={styles["field-row"]}>
                <div className={styles.field}>
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="imageAlt">Alt Text</label>
                  <input
                    type="text"
                    id="imageAlt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Description of the image"
                  />
                </div>

                <button
                  type="button"
                  onClick={addImage}
                  className={styles["add-image-btn"]}
                  disabled={!imageUrl.trim()}
                >
                  Add Image
                </button>
              </div>
            </div>{" "}
            {imagePreviews.length > 0 && (
              <div className={styles["image-previews"]}>
                <h3>Image Previews</h3>
                <div className={styles["preview-grid"]}>
                  {imagePreviews.map((image) => (
                    <div key={image.id} className={styles["preview-item"]}>
                      <img src={image.url} alt={image.alt} />
                      <div className={styles["preview-info"]}>
                        <p>{image.alt}</p>
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className={styles["remove-btn"]}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
          {/* Amenities */}
          <section className={styles.section}>
            <h2>Amenities</h2>{" "}
            <div className={styles["checkbox-grid"]}>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="wifi"
                  name="meta.wifi"
                  checked={formData.meta.wifi}
                  onChange={handleInputChange}
                />
                <label htmlFor="wifi">Wi-Fi</label>
              </div>

              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="parking"
                  name="meta.parking"
                  checked={formData.meta.parking}
                  onChange={handleInputChange}
                />
                <label htmlFor="parking">Parking</label>
              </div>

              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="breakfast"
                  name="meta.breakfast"
                  checked={formData.meta.breakfast}
                  onChange={handleInputChange}
                />
                <label htmlFor="breakfast">Breakfast</label>
              </div>

              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="pets"
                  name="meta.pets"
                  checked={formData.meta.pets}
                  onChange={handleInputChange}
                />
                <label htmlFor="pets">Pets Allowed</label>
              </div>
            </div>
          </section>
          {/* Location */}
          <section className={styles.section}>
            <h2>Location</h2>{" "}
            <div className={styles["field-row"]}>
              <div className={styles.field}>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="zip">ZIP Code</label>
                <input
                  type="text"
                  id="zip"
                  name="location.zip"
                  value={formData.location.zip}
                  onChange={handleInputChange}
                  placeholder="ZIP code"
                />
              </div>
            </div>{" "}
            <div className={styles["field-row"]}>
              <div className={styles.field}>
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="continent">Continent</label>
                <input
                  type="text"
                  id="continent"
                  name="location.continent"
                  value={formData.location.continent}
                  onChange={handleInputChange}
                  placeholder="Continent"
                />
              </div>
            </div>{" "}
            <div className={styles["field-row"]}>
              {" "}
              <div className={styles.field}>
                <label htmlFor="lat">Latitude</label>
                <input
                  type="number"
                  id="lat"
                  name="location.lat"
                  value={displayValues.lat}
                  onChange={handleInputChange}
                  step="any"
                  placeholder="0.0"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="lng">Longitude</label>
                <input
                  type="number"
                  id="lng"
                  name="location.lng"
                  value={displayValues.lng}
                  onChange={handleInputChange}
                  step="any"
                  placeholder="0.0"
                />
              </div>
            </div>
          </section>{" "}
          {/* Submit */}
          <div className={styles["submit-section"]}>
            <button
              type="submit"
              disabled={loading}
              className={styles["submit-btn"]}
            >
              {loading ? "Creating Venue..." : "Create Venue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVenuePage;
