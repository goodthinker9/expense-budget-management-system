/**
 * Central Express error handler.
 *
 * Must be registered AFTER all routes:
 *   app.use(errorHandler)
 *
 * pg error codes handled:
 *   22P02 invalid_text_representation  → 400
 *   22007 invalid_datetime_format      → 400
 *   22008 datetime_field_overflow      → 400
 *   23505 unique_violation             → 409
 *   23503 foreign_key_violation        → 409
 *
 * Application errors set err.status; all others → 500.
 * Raw DB messages are never sent to the client.
 */

const PG_STATUS = {
  '22P02': 400,
  '22007': 400,
  '22008': 400,
  '23505': 409,
  '23503': 409,
};

const PG_MSG = {
  '22P02': 'Invalid value format.',
  '22007': 'Invalid date format.',
  '22008': 'Date field overflow.',
  '23505': 'A record with that value already exists.',
  '23503': 'This record is referenced by other data.',
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  // Log the real error server-side (never sent to client)
  console.error(`[${new Date().toISOString()}] ERROR:`, err.message, err.stack?.split('\n')[1]?.trim());

  // Known pg error codes
  if (err.code && PG_STATUS[err.code]) {
    return res.status(PG_STATUS[err.code]).json({ message: PG_MSG[err.code] });
  }

  // Application errors thrown with err.status
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  // Everything else → 500, no internal details
  res.status(500).json({ message: 'Internal server error.' });
};

export default errorHandler;
