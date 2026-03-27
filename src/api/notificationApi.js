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

export const getNotifications = async () => req("/notifications");

export const markRead = async (id) => req(`/notifications/mark-read/${id}`, {
  method: "POST"
});

export const markAllRead = async () => req("/notifications/mark-all-read", {
  method: "POST"
});
