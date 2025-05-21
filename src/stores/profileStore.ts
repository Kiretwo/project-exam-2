import { create } from "zustand";
import {
  API_PROFILE,
  API_VENUE_MANAGER,
} from "../api/constants";
import { headers } from "../api/headers";

interface Profile {
  id: string;
  name: string;
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
  profile: { id: "", name: "", bio: "", avatar: "", banner: "" },
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
      const res = await fetch(API_PROFILE(username), {
        headers: headers(),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { data } = await res.json(); // Unpack 'data' property

      set({
        profile: {
          id: data.id,
          name: data.name,
          bio: data.bio || "",
          avatar:
            (data.avatar && data.avatar.url) || "/images/profile-picture-placeholder.jpeg",
          banner: (data.banner && data.banner.url) || undefined,
        },
        isVenueManager: !!data.venueManager, // or use roles array if you want
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  toggleVenueManager: async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      set({ error: "No user found. Please log in." });
      return;
    }
    set({ loading: true, error: "" });
    try {
      const { isVenueManager } = get();
      const method = isVenueManager ? "DELETE" : "POST";
      const res = await fetch(API_VENUE_MANAGER(username), {
        method,
        headers: headers(),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      set({
        isVenueManager: !isVenueManager,
        successMessage: isVenueManager
          ? "Venue manager role removed."
          : "You are now a venue manager.",
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  clearMessage: () => {
    set({ successMessage: "" });
  },
}));
