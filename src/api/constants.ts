export const API_BASE = import.meta.env.VITE_NOROFF_API_BASE_URL as string;
export const API_KEY = import.meta.env.VITE_API_KEY as string;

/** Auth endpoints */
export const API_AUTH_REGISTER = `${API_BASE}/auth/register`;
export const API_AUTH_LOGIN = `${API_BASE}/auth/login`;
export const API_AUTH_CREATE_API_KEY = `${API_BASE}/auth/create-api-key`;

/** Holidaze endpoints */
// Profiles
export const API_PROFILES = `${API_BASE}/holidaze/profiles`;

export const API_PROFILE = (name: string) => `${API_PROFILES}/${name}`;

export const API_PROFILES_SEARCH = (query: string) =>
  `${API_PROFILES}/search?q=${encodeURIComponent(query)}`;

export const API_PROFILE_BOOKINGS = (name: string) =>
  `${API_PROFILE(name)}/bookings`;

export const API_PROFILE_VENUES = (name: string) =>
  `${API_PROFILE(name)}/venues`;

export const API_PROFILE_UPDATE = (name: string) => API_PROFILE(name);

// Venues
export const API_VENUES = `${API_BASE}/holidaze/venues`;

export const API_VENUE = (id: string) => `${API_VENUES}/${id}`;

export const API_VENUES_SEARCH = (query: string) =>
  `${API_VENUES}/search?q=${encodeURIComponent(query)}`;

export const API_VENUES_BY_PROFILE = (name: string) =>
  `${API_PROFILE(name)}/venues`;

// Venue Manager Toggle
export const API_VENUE_MANAGER = (name: string) =>
  `${API_PROFILE(name)}/venue-manager`;

// Bookings
export const API_BOOKINGS = `${API_BASE}/holidaze/bookings`;

export const API_BOOKING = (id: string) => `${API_BOOKINGS}/${id}`;

export const API_BOOKINGS_BY_PROFILE = (name: string) =>
  `${API_PROFILE(name)}/bookings`;
