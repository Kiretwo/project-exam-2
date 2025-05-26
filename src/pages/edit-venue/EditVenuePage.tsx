import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_VENUE } from "../../api/constants";
import { headers } from "../../api/headers";
import { isValidImageUrl, validateVenueForm } from "../../utils/validation";
import styles from "../create-venue/CreateVenuePage.module.scss";

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
  id: string;
}

const EditVenuePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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

  // Display values for form inputs
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

  useEffect(() => {
    if (id) {
      fetchVenueData(id);
    }
  }, [id]);

  const fetchVenueData = async (venueId: string) => {
    setFetchLoading(true);
    setError(null);

    try {
      const response = await fetch(API_VENUE(venueId), {
        headers: headers(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch venue: ${response.status}`);
      }

      const result = await response.json();
      const venue = result.data;

      // Pre-fill form data
      setFormData({
        name: venue.name,
        description: venue.description,
        media: venue.media || [],
        price: venue.price,
        maxGuests: venue.maxGuests,
        rating: venue.rating || 0,
        meta: venue.meta || {
          wifi: false,
          parking: false,
          breakfast: false,
          pets: false,
        },
        location: venue.location || {
          address: "",
          city: "",
          zip: "",
          country: "",
          continent: "",
          lat: 0,
          lng: 0,
        },
      });

      // Set display values
      setDisplayValues({
        price: venue.price.toString(),
        rating: venue.rating ? venue.rating.toString() : "",
        lat: venue.location?.lat ? venue.location.lat.toString() : "",
        lng: venue.location?.lng ? venue.location.lng.toString() : "",
        maxGuests: venue.maxGuests.toString(),
      });

      // Set image previews
      if (venue.media && venue.media.length > 0) {
        setImagePreviews(
          venue.media.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || venue.name,
            id: `existing-${index}`,
          }))
        );
      }
    } catch (err: any) {
      console.error("Error fetching venue:", err);
      setError(err.message || "Failed to load venue");
    } finally {
      setFetchLoading(false);
    }
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;

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
    setError(null);
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
        setDisplayValues((prev) => ({ ...prev, [locationKey]: value }));
        const parsedValue = parseFloat(value) || 0;
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, [locationKey]: parsedValue },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, [locationKey]: value },
        }));
      }
    } else {
      if (name === "price" || name === "rating" || name === "maxGuests") {
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
      const venueData = {
        ...formData,
        media: imagePreviews.map((img) => ({ url: img.url, alt: img.alt })),
      };

      const validationErrors = validateVenueForm({
        name: venueData.name,
        description: venueData.description,
        price: venueData.price,
        maxGuests: venueData.maxGuests,
      });

      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }

      const response = await fetch(API_VENUE(id!), {
        method: "PUT",
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
      setSuccess("Venue updated successfully!");

      setTimeout(() => {
        navigate(`/venues/${result.data.id}`);
      }, 2000);
    } catch (err: any) {
      console.error("Error updating venue:", err);
      setError(err.message || "Failed to update venue");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVenue = async () => {
    if (!id) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this venue? This action cannot be undone."
      )
    )
      return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(API_VENUE(id), {
        method: "DELETE",
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error("Failed to delete venue");
      }
      setSuccess("Venue deleted successfully!");
      setTimeout(() => {
        navigate("/profile", { state: { showManageVenues: true } });
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to delete venue");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container">
        <div className={styles.loading}>Loading venue data...</div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="container">
        <div className={styles.error}>{error}</div>
        <button onClick={() => navigate("/manage-venues")}>
          Back to Manage Venues
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles["create-venue-page"]}>
        <div className={styles.header}>
          <h1>Edit Venue</h1>
          <div className={styles["header-actions"]}>
            <button
              type="button"
              onClick={() => navigate("/profile", { state: { showManageVenues: true } })}
              className={styles["back-btn"]}
            >
              Back to Manage Venues
            </button>
            <button
              type="button"
              className={styles["delete-btn"]}
              onClick={handleDeleteVenue}
              disabled={loading}
            >
              Delete Venue
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Information */}
          <div className={styles.section}>
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
                placeholder="Describe your venue"
                rows={4}
              />
            </div>

            <div className={styles["field-row"]}>
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
                  placeholder="0"
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
                  placeholder="0"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="rating">Rating (1-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={displayValues.rating}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className={styles.section}>
            <h2>Images</h2>
            <div className={styles["image-section"]}>
              <div className={styles["add-image"]}>
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
                    <label htmlFor="imageAlt">Image Description</label>
                    <input
                      type="text"
                      id="imageAlt"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Describe the image"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addImage}
                  className={styles["add-image-btn"]}
                >
                  Add Image
                </button>
              </div>

              {imagePreviews.length > 0 && (
                <div className={styles["image-previews"]}>
                  <h3>Image Previews</h3>
                  <div className={styles["preview-grid"]}>
                    {imagePreviews.map((img) => (
                      <div key={img.id} className={styles["preview-item"]}>
                        <img src={img.url} alt={img.alt} />
                        <p>{img.alt}</p>
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className={styles["remove-btn"]}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className={styles.section}>
            <h2>Amenities</h2>
            <div className={styles["amenities-grid"]}>
              <label className={styles["checkbox-field"]}>
                <input
                  type="checkbox"
                  name="meta.wifi"
                  checked={formData.meta.wifi}
                  onChange={handleInputChange}
                />
                Wi-Fi
              </label>
              <label className={styles["checkbox-field"]}>
                <input
                  type="checkbox"
                  name="meta.parking"
                  checked={formData.meta.parking}
                  onChange={handleInputChange}
                />
                Parking
              </label>
              <label className={styles["checkbox-field"]}>
                <input
                  type="checkbox"
                  name="meta.breakfast"
                  checked={formData.meta.breakfast}
                  onChange={handleInputChange}
                />
                Breakfast
              </label>
              <label className={styles["checkbox-field"]}>
                <input
                  type="checkbox"
                  name="meta.pets"
                  checked={formData.meta.pets}
                  onChange={handleInputChange}
                />
                Pets Allowed
              </label>
            </div>
          </div>

          {/* Location */}
          <div className={styles.section}>
            <h2>Location</h2>
            <div className={styles["field-row"]}>
              <div className={styles.field}>
                <label htmlFor="location.address">Address</label>
                <input
                  type="text"
                  id="location.address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="location.city">City</label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
              </div>
            </div>

            <div className={styles["field-row"]}>
              <div className={styles.field}>
                <label htmlFor="location.zip">ZIP Code</label>
                <input
                  type="text"
                  id="location.zip"
                  name="location.zip"
                  value={formData.location.zip}
                  onChange={handleInputChange}
                  placeholder="ZIP code"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="location.country">Country</label>
                <input
                  type="text"
                  id="location.country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>
            </div>

            <div className={styles["field-row"]}>
              <div className={styles.field}>
                <label htmlFor="location.continent">Continent</label>
                <input
                  type="text"
                  id="location.continent"
                  name="location.continent"
                  value={formData.location.continent}
                  onChange={handleInputChange}
                  placeholder="Continent"
                />
              </div>
            </div>

            <div className={styles["field-row"]}>
              <div className={styles.field}>
                <label htmlFor="location.lat">Latitude</label>
                <input
                  type="number"
                  id="location.lat"
                  name="location.lat"
                  value={displayValues.lat}
                  onChange={handleInputChange}
                  step="any"
                  placeholder="0.0"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="location.lng">Longitude</label>
                <input
                  type="number"
                  id="location.lng"
                  name="location.lng"
                  value={displayValues.lng}
                  onChange={handleInputChange}
                  step="any"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={styles["submit-btn"]}
          >
            {loading ? "Updating Venue..." : "Update Venue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVenuePage;
