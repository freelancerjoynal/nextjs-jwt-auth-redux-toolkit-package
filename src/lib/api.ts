const BASE_URL = "http://localhost:8000/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", 
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "something went wrong");
  return data;
};