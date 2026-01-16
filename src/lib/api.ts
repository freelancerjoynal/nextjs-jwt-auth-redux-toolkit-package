const BASE_URL = "http://localhost:8000/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Required to send and receive HttpOnly cookies
  };

  // Initial request attempt
  let response = await fetch(url, defaultOptions);

  // 1. Check if the access token is expired (401 Unauthorized)
  if (response.status === 401) {
    try {
      // 2. Attempt to get a new access token using the refresh token
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include", // Send the refreshToken cookie
      });

      if (refreshResponse.ok) {
        // 3. If refresh is successful, retry the original request
        response = await fetch(url, defaultOptions);
      } else {
        // Refresh token might be expired or invalid
        console.warn("Refresh token expired. User must login again.");
      }
    } catch (refreshError) {
      console.error("Token refresh process failed:", refreshError);
    }
  }

  // Parse JSON data safely
  const data = await response.json().catch(() => ({}));

  // Throw error if the response (or retried response) is still not OK
  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
};