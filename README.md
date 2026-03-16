# TechStudio Home Page

Fully responsive React SPA for the TechStudio studio reservation website.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local → set REACT_APP_API_URL=http://localhost:8000/api
npm start
```

## File Structure

```
src/
├── api/
│   └── studioApi.js          ← All API calls + mock data
├── components/
│   ├── Navbar.jsx             ← Sticky header with blur-on-scroll
│   ├── Footer.jsx             ← Clean footer with links & contact
│   ├── Calendar.jsx           ← Interactive calendar + live availability
│   ├── StudioList.jsx         ← Studio grid + detail modal
│   ├── StudioCard.jsx         ← Individual card with hover effects
│   ├── ReservationForm.jsx    ← 4-step booking wizard (no payment)
│   ├── SpecialOffer.jsx       ← Offers section with promo copy
│   └── AboutCompany.jsx       ← Brand story, stats, activity feed
├── styles/
│   └── globals.css            ← Design tokens + utilities
└── App.jsx                    ← Root: hero + layout composition
```

## API Endpoints (Laravel)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/studios | All studios |
| GET | /api/studios/:id | Single studio |
| GET | /api/studios/availability?date=YYYY-MM-DD | Availability per date |
| POST | /api/reservations | Create reservation |
| GET | /api/offers | Active special offers |

## Colors

| Token | Value | Use |
|-------|-------|-----|
| `--pink-300` | #f5adc8 | Borders, accents |
| `--pink-400` | #ed7aaa | CTA gradient start |
| `--purple-400` | #9575f0 | Eyebrows, icons |
| `--purple-500` | #7c4fe0 | CTA gradient end, headings |