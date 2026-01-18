// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  let requestOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Required for HttpOnly cookies
  };

  // First attempt
  let response = await fetch(url, requestOptions);

  if (response.status === 401) {
    try {
      const tokenRefreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (tokenRefreshResponse.ok) {
        // Case 1: backend sets new access token in HttpOnly cookie
        response = await fetch(url, requestOptions);

        // Case 2: backend returns access token in JSON body
        try {
          const tokenData = await tokenRefreshResponse.json();
          if (tokenData.accessToken) {
            requestOptions.headers = {
              ...requestOptions.headers,
              Authorization: `Bearer ${tokenData.accessToken}`,
            };
            response = await fetch(url, requestOptions);
          }
        } catch {
          // If no JSON body, assume cookie-based refresh
        }
      } else {
        console.warn("Refresh token expired. User must login again.");
      }
    } catch (err) {
      console.error("Token refresh process failed:", err);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
};