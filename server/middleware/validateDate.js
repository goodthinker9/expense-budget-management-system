/**
 * Shared validation helpers used by transaction service.
 *
 * isValidDate(str) — strict YYYY-MM-DD check including real calendar
 *   validation (rejects 2026-02-31, 2026-13-01, etc.).
 *
 * isValidMonth(str) — strict YYYY-MM check.
 */

export function isValidDate(str) {
  // Must match YYYY-MM-DD exactly
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;

  const [year, month, day] = str.split('-').map(Number);

  // Use Date to validate the calendar date, but reconstruct the
  // ISO string to confirm no overflow (e.g. Feb 31 → Mar 3).
  const d = new Date(str);
  return (
    d.getFullYear()  === year  &&
    d.getMonth() + 1 === month &&
    d.getDate()      === day
  );
}

export function isValidMonth(str) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(str);
}
