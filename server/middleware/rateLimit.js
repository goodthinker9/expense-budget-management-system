/**
 * Rate limiters using express-rate-limit.
 *
 * Set DISABLE_RATE_LIMIT=true in .env to bypass all limits during local testing.
 * Never set that in production.
 */

import rateLimit from 'express-rate-limit';

const disabled = process.env.DISABLE_RATE_LIMIT === 'true';

/** Build a limiter — returns a no-op middleware when DISABLE_RATE_LIMIT=true. */
function makeLimiter({ windowMs, max, message, skipSuccessfulRequests = false }) {
  if (disabled) {
    // eslint-disable-next-line no-unused-vars
    return (_req, _res, next) => next();
  }
  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    standardHeaders: true,   // RateLimit-* response headers (RFC 6585 draft)
    legacyHeaders: false,     // disable X-RateLimit-* headers
    handler: (_req, res) => {
      res.status(429).json({ message });
    },
  });
}

const FIFTEEN_MIN = 15 * 60 * 1000;
const SLOW_MSG    = 'Too many attempts, please try again later.';

/**
 * POST /api/auth/login — 10 FAILED requests per 15 minutes per IP.
 * Successful logins (2xx) are not counted, so legitimate users are never
 * locked out just because they logged in many times.
 */
export const loginLimiter = makeLimiter({
  windowMs: FIFTEEN_MIN,
  max: 10,
  skipSuccessfulRequests: true,
  message: SLOW_MSG,
});

/**
 * POST /api/auth/register — 10 requests per 15 minutes per IP.
 * All requests count (success or failure) to prevent account-creation abuse.
 */
export const registerLimiter = makeLimiter({
  windowMs: FIFTEEN_MIN,
  max: 10,
  message: SLOW_MSG,
});

/** PUT /api/auth/change-password — 5 per 15 minutes per IP. */
export const passwordLimiter = makeLimiter({
  windowMs: FIFTEEN_MIN,
  max: 5,
  message: SLOW_MSG,
});

/** Everything under /api — 300 per 15 minutes per IP. */
export const apiLimiter = makeLimiter({
  windowMs: FIFTEEN_MIN,
  max: 300,
  message: SLOW_MSG,
});
