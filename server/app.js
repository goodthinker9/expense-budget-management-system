import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import authRouter        from './routes/authRoute.js';
import categoryRouter    from './routes/categoryRoute.js';
import transactionRouter from './routes/transactionRoute.js';
import reportRouter      from './routes/reportRoute.js';
import budgetRouter      from './routes/budgetRoute.js';
import errorHandler      from './middleware/errorHandler.js';
import { apiLimiter }    from './middleware/rateLimit.js';
dotenv.config();

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── Trust the first proxy hop (Render, Railway, etc.) ────────────────────────
// Without this, rate-limiting would see the proxy IP, not the client IP.
app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────────────────────
// CLIENT_ORIGIN may be a comma-separated list of allowed origins.
// Requests with no Origin header (curl, server-to-server, /health) are allowed.
const rawOrigins = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const allowedOrigins = new Set(
  rawOrigins.split(',').map((o) => o.trim()).filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no Origin (curl, health checks, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    // Return null (block the request) — Express CORS will send a 403
    // We handle this with the corsBlocker below instead of an Error object
    // to avoid a 500 from the error handler.
    return callback(null, false);
  },
  credentials: true,
}));

// When CORS rejects an origin, the cors middleware sets no headers and calls
// next() — we intercept here and return 403 before the route handlers run.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ message: 'Origin not allowed' });
  }
  next();
});

// ── Body parser — 10 KB limit ─────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Health check — no auth, no DB, before rate limiter ───────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ── Global API rate limiter ───────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRouter);
app.use('/api/category',    categoryRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/reports',     reportRouter);
app.use('/api/budget',      budgetRouter);

// ── Central error handler — must be last ─────────────────────────────────────
app.use(errorHandler);

export default app;
