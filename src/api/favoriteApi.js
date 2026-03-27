import i18n from '../i18n';

let BASE = process.env.REACT_APP_API_URL || "/api";
if (!BASE.endsWith("/api") && !BASE.endsWith("/api/")) {
  BASE = BASE.replace(/\/$/, "") + "/api";
}

async function req(path, opts = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept:         "application/json",
    "Accept-Language": i18n.language || 'en',
    ...(opts.headers || {}),
  };

  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers,
  });

  const body = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
  if (!res.ok) {
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return body;
}

export const getFavorites = async () => req("/favorites");

export const addFavorite = async (studioId) => req("/favorites", {
  method: "POST",
  body: JSON.stringify({ studio_id: studioId }),
});

export const removeFavorite = async (studioId) => req(`/favorites/${studioId}`, {
  method: "DELETE",
});
