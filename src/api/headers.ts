import { API_KEY } from "./constants";

export function headers(): Headers {
  const h = new Headers();

  // Attach API key
  if (API_KEY) {
    h.append("X-Noroff-API-Key", API_KEY);
  }

  // Attach Bearer token if user is authenticated
  const token = localStorage.getItem("accessToken");
  if (token) {
    h.append("Authorization", `Bearer ${token}`);
  }

  // Always expect/send JSON
  h.append("Content-Type", "application/json");

  return h;
}
