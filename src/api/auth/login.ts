const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = import.meta.env.VITE_NOROFF_API_BASE_URL;

/** Credentials for login */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** The shape of what the login endpoint returns under `data` */
export interface UserProfileData {
  name: string;
  email: string;
  avatar: { url: string; alt: string } | null;
  banner: { url: string; alt: string } | null;
  accessToken: string;
  venueManager?: boolean;
}

/** Full API response */
export interface LoginApiResponse {
  data: UserProfileData;
  meta: object;
}

/**
 * POST /auth/login?_holidaze=true
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginApiResponse> => {
  if (!API_KEY || !API_BASE_URL) {
    throw new Error(
      "API configuration error. Check your VITE_API_KEY / VITE_NOROFF_API_BASE_URL"
    );
  }

  const loginUrl = new URL(`${API_BASE_URL}/auth/login`);
  loginUrl.searchParams.append("_holidaze", "true");

  const response = await fetch(loginUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(credentials),
  });

  const responseData = await response.json();
  if (!response.ok) {
    const msg =
      responseData.errors?.[0]?.message ||
      `Login failed with status ${response.status}`;
    throw new Error(msg);
  }

  return responseData as LoginApiResponse;
};

/** Store the token & username in localStorage */
export const storeAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};
export const storeUserName = (name: string) => {
  localStorage.setItem("userName", name);
};

/** Retrieve them later */
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};
export const getUserName = (): string | null => {
  return localStorage.getItem("userName");
};

/** Clear everything (e.g. on logout) */
export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
  localStorage.removeItem("isVenueManager");
};
