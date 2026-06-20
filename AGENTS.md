# Quizitt Donation

A full-stack donation/payment integration project for the Quizitt platform. Consists of a React + Vite frontend and a Node.js/Express backend wired to Razorpay for payment processing and MongoDB for data storage.

## Tech Stack

- **Frontend**: TypeScript, React 18 + Vite, shadcn/ui (Radix UI + Tailwind CSS), react-hook-form + zod
- **Backend**: Node.js, Express, Mongoose (MongoDB), Razorpay, CORS, dotenv

## Setup

**Frontend** (`frontend/`):
```bash
cd frontend
npm install
# or bun install (bun.lockb present)
```

**Backend** (`backend/`):
```bash
cd backend
npm install
```

Backend requires a `.env` file with:
- `MONGODB_URI` — MongoDB connection string
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — Razorpay credentials
- `PORT` (optional, defaults to server default)

## Build / Run / Test

**Frontend**:
```bash
cd frontend
npm run dev       # Dev server
npm run build     # Production build
npm run preview   # Preview build
npm run lint
```

**Backend**:
```bash
cd backend
npm run dev       # Start with nodemon (auto-reload)
```

## Project Structure

```
frontend/             # React + Vite SPA
  src/                # Components, pages, hooks, lib
  components/         # Shared UI (shadcn/ui)
  public/             # Static assets
  index.html          # Entry HTML
  vite.config.ts      # Vite config
  components.json     # shadcn/ui config
backend/              # Node.js Express API
  index.js            # Entry point
  src/
    controllers/      # Route handlers
    models/           # Mongoose schemas
    routes/           # Express routers
  package.json
```

## Architecture & Key Files

- Frontend calls the backend via HTTP (likely on `localhost:PORT`); check for API base URL in `frontend/src/`.
- `backend/src/controllers/` holds Razorpay order creation and payment verification logic.
- `backend/src/models/` defines donation/payment schemas.
- `backend/index.js` bootstraps Express and connects to MongoDB.

## Conventions & Notes for Agents

- Two separate Node.js runtimes — run frontend and backend in separate terminals.
- shadcn/ui components are in `frontend/src/components/ui/`; add via CLI or copy from existing files.
- Razorpay webhooks need signature verification — do not bypass the `crypto` verification step.
- Environment variables must use `VITE_` prefix to be accessible from the React frontend.
- No test suite is configured.
- `vercel.json` in `frontend/` enables Vercel deployment for the frontend only.
