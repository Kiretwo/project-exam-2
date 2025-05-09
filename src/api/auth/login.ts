// Retrieve environment variables
const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = import.meta.env.VITE_NOROFF_API_BASE_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  avatar: {
    url: string;
    alt: string;
  } | null;
  banner: {
    url: string;
    alt: string;
  } | null;
  accessToken: string;
  venueManager?: boolean;
}

export interface LoginApiResponse {
  data: UserProfileData;
  meta: object;
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginApiResponse> => {
  if (!API_KEY || !API_BASE_URL) {
    console.error("API Key or Base URL is not defined in .env file");
    throw new Error(
      "API configuration error. Please check environment variables."
    );
  }

  console.log("Attempting to log in with:", credentials);
  const loginUrl = new URL(`${API_BASE_URL}/auth/login`);
  loginUrl.searchParams.append("_holidaze", "true");

  try {
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
      console.error("API Error Response:", responseData);
      const errorMessage =
        responseData.errors?.[0]?.message ||
        `Login failed with status: ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log("Login successful (API)");
    return responseData as LoginApiResponse;
  } catch (error) {
    console.error("Login API call error:", error);
    throw error;
  }
};

export const storeAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("AccessToken");
};

export const clearAccessToken = () => {
  localStorage.removeItem("AccessToken");
};
