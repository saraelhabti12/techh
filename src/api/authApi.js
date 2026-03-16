// src/api/authApi.js
// Ensure the API base URL points to the Laravel API namespace (e.g. http://localhost:8000/api)
let API_BASE_URL = process.env.REACT_APP_API_URL || "/api";
if (!API_BASE_URL.endsWith("/api") && !API_BASE_URL.endsWith("/api/")) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, "") + "/api";
}

// Laravel Sanctum expects the CSRF endpoint at /sanctum/csrf-cookie (not /api/sanctum/csrf-cookie).
// If the configured API base URL includes a trailing /api, strip it for CSRF calls.
const CSRF_BASE_URL = API_BASE_URL.replace(/\/?api\/?$/, "");

async function getCsrfToken() {
  await fetch(`${CSRF_BASE_URL}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
  });
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Fetch CSRF token before any POST request
  if (options.method === "POST" || options.method === "PUT" || options.method === "PATCH" || options.method === "DELETE") {
    await getCsrfToken();
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: "include", // Important for sending cookies like XSRF-TOKEN
    });
  } catch (fetchError) {
    throw new Error(`Network error: ${fetchError.message}. Is the API running at ${API_BASE_URL}?`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    const error = new Error(errorData.message || "Something went wrong.");
    error.response = { status: response.status, data: errorData }; // Attach response details
    throw error;
  }

  return response.json();
}

export const register = async (name, email, password, password_confirmation) => {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
};

export const login = async (email, password) => {
  const data = await request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("authToken", data.access_token);
  return data;
};

export const logout = async () => {
  await request("/logout", {
    method: "POST",
  });
  localStorage.removeItem("authToken");
};

export const getUser = async () => {
  return request("/user");
};

export const getMyReservations = async () => {
  return request("/my-reservations");
};

export const cancelReservation = async (reservationId) => {
  return request(`/reservations/${reservationId}/cancel`, {
    method: "POST",
  });
};