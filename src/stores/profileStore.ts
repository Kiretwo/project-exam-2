import { create } from "zustand";
import {
  API_PROFILE,
  API_PROFILE_UPDATE,
  API_PROFILE_VENUES,
} from "../api/constants";
import { headers } from "../api/headers";

interface Profile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  banner?: string; // Optional banner URL
}

interface Customer {
  name: string;
  email: string;
  avatar?: {
    url: string;
    alt: string;
  };
}

interface Venue {
  id: string;
  name: string;
  location: {
    address?: string;
    city?: string;
    country?: string;
  };
  media: Array<{
    url: string;
    alt: string;
  }>;
}

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  customer: Customer;
}

interface VenueWithBookings {
  venue: Venue;
  bookings: Booking[];
}

interface ProfileState {
  profile: Profile;
  isVenueManager: boolean;
  venuesWithBookings: VenueWithBookings[];
  receivedBookingsLoading: boolean;
  receivedBookingsError: string;
  loading: boolean;
  error: string;
  successMessage: string;
  // Edit mode state
  isEditMode: boolean;
  editProfile: Profile;
  updateLoading: boolean;
  showImageModal: boolean;
  imageModalType: "avatar" | "banner" | null;
  fetchProfile: () => Promise<void>;
  fetchReceivedBookings: () => Promise<void>;
  toggleVenueManager: () => Promise<void>;
  clearMessage: () => void;
  // Edit mode functions
  setEditMode: (enabled: boolean) => void;
  updateEditProfile: (field: keyof Profile, value: string) => void;
  updateProfile: () => Promise<void>;
  cancelEdit: () => void;
  showImageUrlModal: (type: "avatar" | "banner") => void;
  hideImageModal: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: { id: "", name: "", email: "", bio: "", avatar: "", banner: "" },
  isVenueManager: false,
  venuesWithBookings: [],
  receivedBookingsLoading: false,
  receivedBookingsError: "",
  loading: false,
  error: "",
  successMessage: "",
  // Edit mode state
  isEditMode: false,
  editProfile: { id: "", name: "", email: "", bio: "", avatar: "", banner: "" },
  updateLoading: false,
  showImageModal: false,
  imageModalType: null,

  fetchProfile: async () => {
    const username = localStorage.getItem("userName");
    if (!username) {
      set({ error: "No user found. Please log in." });
      return;
    }
    set({ loading: true, error: "" });
    try {
      console.log("Fetching profile with username:", username);
      console.log("Headers:", headers());

      const res = await fetch(API_PROFILE(username), {
        headers: headers(),
      });

      if (!res.ok) {
        const responseText = await res.text();
        console.error("API Error:", res.status, responseText);
        throw new Error(
          `Error ${res.status}: ${responseText || "Unknown error"}`
        );
      }

      const { data } = await res.json(); // Unpack 'data' property
      console.log("Profile data received:", data);
      set({
        profile: {
          id: data.id,
          name: data.name,
          email: data.email || "",
          bio: data.bio || "",
          avatar:
            (data.avatar && data.avatar.url) ||
            "/images/profile-picture-placeholder.jpeg",
          banner: (data.banner && data.banner.url) || undefined,
        },
        isVenueManager: !!data.venueManager, // or use roles array if you want
      });
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
  fetchReceivedBookings: async () => {
    const username = localStorage.getItem("userName");
    if (!username) {
      set({ receivedBookingsError: "No user found. Please log in." });
      return;
    }

    set({ receivedBookingsLoading: true, receivedBookingsError: "" });
    try {
      console.log("Fetching venues with bookings for username:", username);

      const apiUrl = `${API_PROFILE_VENUES(username)}?_bookings=true`;
      console.log("API URL:", apiUrl);
      console.log("Headers:", headers());

      // Fetch user's venues with bookings included
      const res = await fetch(apiUrl, {
        headers: headers(),
      });

      if (!res.ok) {
        const responseText = await res.text();
        console.error("API Error:", res.status, responseText);
        throw new Error(
          `Error ${res.status}: ${responseText || "Unknown error"}`
        );
      }

      const { data } = await res.json();
      console.log("Venues with bookings data received:", data);

      // Transform the data to match our interface
      const venuesWithBookings: VenueWithBookings[] = data.map(
        (venue: any) => ({
          venue: {
            id: venue.id,
            name: venue.name,
            location: venue.location || {},
            media: venue.media || [],
          },
          bookings: venue.bookings || [],
        })
      );

      set({
        venuesWithBookings,
        receivedBookingsLoading: false,
      });
    } catch (err: any) {
      console.error("Fetch received bookings error:", err);
      set({
        receivedBookingsError: err.message,
        receivedBookingsLoading: false,
      });
    }
  },
  toggleVenueManager: async () => {
    const username = localStorage.getItem("userName");
    if (!username) {
      set({ error: "No user found. Please log in." });
      return;
    }
    set({ loading: true, error: "" });
    try {
      const { isVenueManager } = get();

      console.log("Toggle venue manager for user:", username);
      console.log("Current isVenueManager status:", isVenueManager);

      // Create updated profile data with venueManager property
      const updatedProfile = {
        venueManager: !isVenueManager,
      };
      console.log("API endpoint:", API_PROFILE_UPDATE(username));
      console.log("Update data:", updatedProfile);
      console.log("Headers:", headers());

      const res = await fetch(API_PROFILE_UPDATE(username), {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(updatedProfile),
      });
      if (!res.ok) {
        const responseText = await res.text();
        console.error("API Error:", res.status, responseText);
        throw new Error(
          `Error ${res.status}: ${responseText || "Unknown error"}`
        );
      } // Log response status
      console.log("Toggle successful, response status:", res.status);

      // Clone the response before reading its JSON to avoid "body already read" errors
      const responseClone = res.clone();
      let newVenueManagerStatus;

      try {
        // Parse the response to verify the update succeeded
        const responseData = await res.json();
        console.log("API response data:", responseData);

        // Update the state based on response data
        newVenueManagerStatus =
          responseData.data?.venueManager || !isVenueManager;
        console.log("Setting isVenueManager to:", newVenueManagerStatus);
      } catch (jsonError) {
        // If JSON parsing fails, log the raw response
        console.error("Failed to parse response JSON:", jsonError);
        const rawResponse = await responseClone.text();
        console.log("Raw response:", rawResponse);

        // Just toggle based on previous state as fallback
        newVenueManagerStatus = !isVenueManager;
      } // Update state
      set({
        isVenueManager: newVenueManagerStatus,
        successMessage: isVenueManager
          ? "Venue manager role removed."
          : "You are now a venue manager.",
      });

      // Update localStorage to ensure UI components are updated
      localStorage.setItem("isVenueManager", String(newVenueManagerStatus));
      console.log(
        "Updated isVenueManager in localStorage:",
        newVenueManagerStatus
      );

      // Dispatch custom event for cross-component communication
      const venueManagerEvent = new CustomEvent("venueManagerStatusChanged", {
        detail: { isVenueManager: newVenueManagerStatus },
      });
      window.dispatchEvent(venueManagerEvent);

      // Also dispatch storage event for backward compatibility
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      console.error("Toggle venue manager error:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  clearMessage: () => {
    set({ successMessage: "" });
  },

  setEditMode: (enabled: boolean) => {
    const { profile } = get();
    set({
      isEditMode: enabled,
      editProfile: enabled ? { ...profile } : profile,
      error: "",
      successMessage: "",
    });
  },

  updateEditProfile: (field: keyof Profile, value: string) => {
    const { editProfile } = get();
    set({
      editProfile: { ...editProfile, [field]: value },
    });
  },

  updateProfile: async () => {
    const username = localStorage.getItem("userName");
    if (!username) {
      set({ error: "No user found. Please log in." });
      return;
    }

    set({ updateLoading: true, error: "", successMessage: "" });

    try {
      const { editProfile } = get();

      // Prepare the update data
      const updateData = {
        bio: editProfile.bio,
        avatar: {
          url: editProfile.avatar,
          alt: `${editProfile.name}'s avatar`,
        },
        banner: editProfile.banner
          ? {
              url: editProfile.banner,
              alt: `${editProfile.name}'s banner`,
            }
          : undefined,
      };

      console.log("Updating profile with data:", updateData);

      const res = await fetch(API_PROFILE_UPDATE(username), {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const responseText = await res.text();
        console.error("Profile update error:", res.status, responseText);
        throw new Error(
          `Error ${res.status}: ${responseText || "Failed to update profile"}`
        );
      }

      const { data } = await res.json();
      console.log("Profile updated successfully:", data);

      // Update the profile state with the new data
      set({
        profile: {
          id: data.id,
          name: data.name,
          email: data.email || "",
          bio: data.bio || "",
          avatar:
            (data.avatar && data.avatar.url) ||
            "/images/profile-picture-placeholder.jpeg",
          banner: (data.banner && data.banner.url) || undefined,
        },
        isEditMode: false,
        successMessage: "Profile updated successfully!",
        updateLoading: false,
      });
    } catch (err: any) {
      console.error("Profile update error:", err);
      set({
        error: err.message,
        updateLoading: false,
      });
    }
  },

  cancelEdit: () => {
    const { profile } = get();
    set({
      isEditMode: false,
      editProfile: { ...profile },
      error: "",
      successMessage: "",
    });
  },

  showImageUrlModal: (type: "avatar" | "banner") => {
    set({
      showImageModal: true,
      imageModalType: type,
    });
  },

  hideImageModal: () => {
    set({
      showImageModal: false,
      imageModalType: null,
    });
  },
}));
