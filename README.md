# SpeakDaily (SpeakUp) — Daily Speaking Coach

SpeakDaily (working product name **SpeakUp**) is a web app that helps you improve your speaking skills through **daily video uploads**, **rule-based audio/transcript analysis**, and **progress tracking** over time.

- **Frontend**: Next.js (App Router) + React + Tailwind
- **Backend**: FastAPI (Python) + Supabase (Postgres)
- **Charts/UI**: Recharts, Framer Motion, Lucide icons

> This repo currently includes UI screens and a FastAPI backend scaffold; many screens use mock data until the API wiring is completed.

---

## Features (current + planned)

- **Landing page**: product marketing sections (Hero, How it works, Metrics preview, Progress preview)
- **Auth (backend)**: email/password signup/login with httpOnly cookie (`speakup_token`)
- **Daily upload flow (UI)**: upload page + session report routing
- **Progress tracking (UI)**: charts and streak visualization (mocked)
- **Planned analysis engine**: Whisper transcription + rule-based scoring (WPM, fillers, clarity, tone, structure)

For the full product spec, see `prd_speakup.md`.

---

## Repo structure

```text
SpeakDaily/
  app/                   # Next.js App Router pages
  components/            # UI + feature components
  lib/                   # shared helpers (client utilities, etc.)
  backend/               # FastAPI API server
    routes/              # auth/sessions/summaries routers
    requirements.txt     # backend dependencies
    .env.example         # backend env template
```

---

## Prerequisites

- **Node.js**: 18+ recommended
- **Python**: 3.10+ recommended (3.11 is a good default)
- **Git**
- **Supabase project** (Postgres) for the backend to function end-to-end

---

## Environment variables

### Frontend (`.env.local`)

Copy the example and fill values:

```bash
cp .env.local.example .env.local
```

Variables:

- `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Backend (`backend/.env`)

Copy the example and fill values:

```bash
cd backend
cp .env.example .env
```

Required variables (see `backend/config.py`):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET` (minimum 32 chars recommended)
- `OPENAI_API_KEY` (needed once transcription/analysis is enabled)
- `FRONTEND_URL` (default `http://localhost:3000`)

Optional (only if you enable upload storage):

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`
- `S3_REGION`

---

## Running locally

### 1) Frontend (Next.js)

From the repo root:

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

### 2) Backend (FastAPI)

In a separate terminal:

```bash
cd backend
python -m venv .venv
./.venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API runs at `http://localhost:8000`.

Health check:

- `GET /health` → `{ "status": "ok" }`

---

## API notes

### CORS

The backend enables CORS for the configured frontend origin (`FRONTEND_URL`), and allows credentials for cookie-based auth.

### Auth cookies

On successful login/signup, the backend sets an httpOnly cookie:

- Cookie name: `speakup_token`
- `secure` is currently **false** for local dev; set it to **true** behind HTTPS in production.

---

## Common scripts

Frontend:

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — lint

Backend:

- `uvicorn main:app --reload` — run API in dev mode

---

## Security / secrets

- Do **not** commit real secrets.
- This repo intentionally ignores:
  - `.env*` and `backend/.env`
  - `.mcp.json` (it may contain API keys)

If you need MCP config for local development, copy:

```bash
cp .mcp.json.example .mcp.json
```

---

## Deployment (suggested)

- **Frontend**: Vercel
  - Set env vars from `.env.local` in Vercel project settings
- **Backend**: Render / Railway / Fly.io
  - Set env vars from `backend/.env`
  - Ensure HTTPS so auth cookies can be `secure=true`
- **Database**: Supabase (managed Postgres)
- **Storage (optional)**: S3-compatible (AWS S3 / Cloudflare R2)

---

## Troubleshooting

- **CORS / cookie not set**: confirm `FRONTEND_URL` matches your actual frontend URL and that requests are made with credentials.
- **Frontend can’t reach backend**: verify `NEXT_PUBLIC_API_URL` and that the backend is running on port 8000.
- **Supabase errors**: confirm service key vs anon key is used in the right place (backend uses service key).


