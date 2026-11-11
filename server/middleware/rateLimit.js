/**
 * Rate limiters using express-rate-limit.
 *
 * Set DISABLE_RATE_LIMIT=true in .env to bypass all limits during local testing.
 * Never set that in production.
 */

import rateLimit from 'express-rate-limit';

const disabled = process.env.DISABLE_RATE_LIMIT === 'true';

/** Build a limiter — returns a no-op middleware when DISABLE_RATE_LIMIT=true. */
function makeLimiter({ windowMs, max, message }) {
  if (disabled) {
    // eslint-disable-next-line no-unused-vars
    return (_req, _res, next) => next();
  }
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,   // RateLimit-* response headers (RFC 6585 draft)
    legacyHeaders: false,     // disable X-RateLimit-* headers
    handler: (_req, res) => {
      res.status(429).json({ message });
    },
  });
}

const FIFTEEN_MIN = 15 * 60 * 1000;
const SLOW_MSG    = 'Too many attempts, please try again later.';

/** POST /api/auth/login  and  POST /api/auth/register — 10 / 15 min */
export const authLimiter = makeLimiter({
  windowMs: FIFTEEN_MIN,
  max: 10,
  message: SLOW_MSG,
});

/** PUT /api/auth/change-password — 5 / 15 min */
export const passwordLimiter = makeLimiter({
  windowMs: FIFTEEN_MIN,
  max: 5,
  message: SLOW_MSG,
});

/** Everything under /api — 300 / 15 min */
export const apiLimiter = makeLimiter({
  windowMs: FIFTEEN_MIN,
  max: 300,
  message: SLOW_MSG,
});
