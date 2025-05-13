const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = import.meta.env.VITE_NOROFF_API_BASE_URL;

export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  bio?: string; // Optional
  avatar?: {
    // Optional object
    url: string; // Required if avatar object is present
    alt?: string; // Optional alt text
  } | null;
  banner?: {
    // Optional object
    url: string; // Required if banner object is present
    alt?: string; // Optional alt text
  } | null;
  venueManager?: boolean;
}

// Define the expected shape of the API response for registration
export interface RegisterApiResponse {
  data: {
    name: string;
    email: string;
    bio?: string;
    avatar: { url: string; alt: string } | null; // API shows url/alt as non-optional if avatar object exists
    banner: { url: string; alt: string } | null; // API shows url/alt as non-optional if banner object exists
    venueManager: boolean;
  };
  meta?: object;
}

export const registerUser = async (
  userData: UserRegistrationData
): Promise<RegisterApiResponse> => {
  if (!API_KEY || !API_BASE_URL) {
    console.error("API Key or Base URL is not defined in .env file");
    throw new Error(
      "API configuration error. Please check environment variables."
    );
  }

  const registerUrl = new URL(`${API_BASE_URL}/auth/register`);

  // Construct the request body based on userData and API spec
  const requestBody: {
    name: string;
    email: string;
    password: string;
    bio?: string;
    avatar?: { url: string; alt: string };
    banner?: { url: string; alt: string };
    venueManager?: boolean;
  } = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  };

  if (userData.venueManager !== undefined) {
    requestBody.venueManager = userData.venueManager;
  }

  if (userData.bio) {
    requestBody.bio = userData.bio;
  }

  if (userData.avatar && userData.avatar.url) {
    requestBody.avatar = {
      url: userData.avatar.url,
      alt: userData.avatar.alt || "", // Defaults to empty string if alt is not provided
    };
  }

  if (userData.banner && userData.banner.url) {
    requestBody.banner = {
      url: userData.banner.url,
      alt: userData.banner.alt || "", // Defaults to empty string if alt is not provided
    };
  }

  console.log("Attempting to register with (API):", requestBody);

  try {
    const response = await fetch(registerUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("API Registration Error Response:", responseData);
      const errorMessage =
        responseData.errors?.[0]?.message ||
        `Registration failed with status: ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log("Registration successful (API)", responseData);
    return responseData as RegisterApiResponse;
  } catch (error) {
    console.error("Registration API call error:", error);
    throw error;
  }
};
