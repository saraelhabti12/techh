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

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Dashboard & Stats ──────────────────────────────────────────
export const getAdminStats = () => req("/admin/stats");
export const getStudioCalendar = (studioId, start, end) => 
  req(`/admin/studios/${studioId}/calendar?start=${start}&end=${end}`);

// ── Studios ────────────────────────────────────────────────────
export const getAdminStudios = (page = 1, search = "") => 
  req(`/admin/studios?page=${page}&search=${search}`);
export const createAdminStudio = (data) => req("/admin/studios", { method: "POST", body: JSON.stringify(data) });
export const updateAdminStudio = (id, data) => req(`/admin/studios/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteAdminStudio = (id) => req(`/admin/studios/${id}`, { method: "DELETE" });

// ── Reservations ───────────────────────────────────────────────
export const getAdminReservations = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return req(`/admin/reservations?${q}`);
};
export const getAdminReservationDetail = (id) => req(`/admin/reservations/${id}`);
export const updateReservationStatus = (id, status) => 
  req(`/admin/reservations/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const deleteReservation = (id) => req(`/admin/reservations/${id}`, { method: "DELETE" });

// ── Users ──────────────────────────────────────────────────────
export const getAdminUsers = (page = 1, search = "") => 
  req(`/admin/users?page=${page}&search=${search}`);
export const getAdminUserDetail = (id) => req(`/admin/users/${id}`);
export const toggleUserAdmin = (id) => req(`/admin/users/${id}/toggle-admin`, { method: "POST" });
export const toggleUserBan = (id) => req(`/admin/users/${id}/toggle-ban`, { method: "POST" });
