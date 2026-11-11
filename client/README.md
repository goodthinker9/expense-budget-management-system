# FinTrackET — Client

React + Vite frontend for the FinTrackET expense and budget manager.

---

## Environment Variables

Copy `.env.example` to `.env` before running:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the Express server, e.g. `http://localhost:4000` |
| `VITE_USE_MOCK` | Set to `true` to use the built-in mock API (no backend needed), `false` to use the real server |

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server on `http://localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | Run ESLint |

---

## Run locally

```bash
npm install
npm run dev
```

See the [root README](../README.md) for the full setup guide including the server and database.
