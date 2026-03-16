/**
 * TechStudio API Service
 * ─────────────────────────────────────────────────────────────────────
 * Base URL pulled from REACT_APP_API_URL in .env
 * Example .env:  REACT_APP_API_URL=http://localhost:8000/api
 *
 * Laravel API endpoints expected:
 *  GET  /api/studios                              → all studios
 *  GET  /api/studios/:id                          → single studio
 *  GET  /api/studios/availability?date=YYYY-MM-DD → availability for all studios
 *  POST /api/reservations                         → create reservation
 *  GET  /api/offers                               → active special offers
 */

// Ensure the API base URL points to the Laravel API namespace (e.g. http://localhost:8000/api)
let BASE = process.env.REACT_APP_API_URL || "/api";
if (!BASE.endsWith("/api") && !BASE.endsWith("/api/")) {
  BASE = BASE.replace(/\/$/, "") + "/api";
}

// ── Low-level helper ─────────────────────────────────────────
async function req(path, opts = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept:         "application/json",
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

// ── Studios ──────────────────────────────────────────────────
/**
 * GET /api/studios
 * @returns { data: Studio[] }
 */
export const getStudios = async () => req("/studios");

/**
 * GET /api/studios/:id
 * @returns { data: Studio }
 */
export const getStudio = async (id) => req(`/studios/${id}`);

/**
 * GET /api/studios/availability?date=YYYY-MM-DD
 * @returns { data: { studio_id, date, status, price }[] }
 */
export const getAvailability = async (date) => req(`/studios/availability?date=${date}`);

// ── Reservations ─────────────────────────────────────────────
/**
 * POST /api/reservations
 * body: { studio_id, date, time_slot, hours, name, email, phone }
 * @returns { data: { id, ...reservation } }
 */
export const createReservation = async (data) => req("/reservations", {
  method: "POST",
  body: JSON.stringify(data),
});

// ── Offers ───────────────────────────────────────────────────
/**
 * GET /api/offers
 * @returns { data: Offer[] }
 */
export const getOffers = async () => req("/offers");

// ── Removed Mock data (now using backend) ─────────────