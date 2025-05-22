import { create } from "zustand";
import { API_PROFILE, API_PROFILE_UPDATE } from "../api/constants";
import { headers } from "../api/headers";

interface Profile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  banner?: string; // Optional banner URL
}

interface ProfileState {
  profile: Profile;
  isVenueManager: boolean;
  loading: boolean;
  error: string;
  successMessage: string;
  fetchProfile: () => Promise<void>;
  toggleVenueManager: () => Promise<void>;
  clearMessage: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: { id: "", name: "", email: "", bio: "", avatar: "", banner: "" },
  isVenueManager: false,
  loading: false,
  error: "",
  successMessage: "",
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
}));
