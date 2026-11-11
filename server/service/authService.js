import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkuserExist, registerUserModel, getUserById } from '../model/authModel.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── shared sanitisers ─────────────────────────────────────────────────────────

/** Trim and lowercase. Returns the cleaned string. */
function cleanEmail(raw) {
  return (raw ?? '').trim().toLowerCase();
}

/** Validate email format; throws 400 with consistent message on failure. */
function validateEmail(email) {
  if (!EMAIL_RE.test(email)) {
    const err = new Error('Invalid email address');
    err.status = 400; throw err;
  }
}

/**
 * Validate password length.
 *   - minimum 6 characters
 *   - maximum 72 characters (bcrypt silently ignores everything after byte 72)
 */
function validatePassword(password) {
  if (!password || password.length < 6) {
    const err = new Error('Password must be at least 6 characters');
    err.status = 400; throw err;
  }
  if (password.length > 72) {
    const err = new Error('Password must be 72 characters or fewer');
    err.status = 400; throw err;
  }
}

// ── register ──────────────────────────────────────────────────────────────────

export const registerService = async (data) => {
  const { password } = data;
  const name  = (data.name  ?? '').trim();
  const email = cleanEmail(data.email);

  if (!name || !email || !password) {
    const err = new Error('name, email and password are required');
    err.status = 400; throw err;
  }

  // name: 1–100 characters
  if (name.length > 100) {
    const err = new Error('name must be 100 characters or fewer');
    err.status = 400; throw err;
  }

  validateEmail(email);
  validatePassword(password);

  const existing = await checkuserExist(email);
  if (existing) {
    const err = new Error('Email is already registered');
    err.status = 409; throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await registerUserModel({ name, email, password: hashedPassword });

  const user = await getUserById(userId);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, user };
};

// ── login ─────────────────────────────────────────────────────────────────────

export const loginService = async (data) => {
  const { password } = data;
  const email = cleanEmail(data.email);

  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400; throw err;
  }

  validateEmail(email);

  // Use identical 401 message for unknown email AND wrong password to prevent
  // user enumeration via different error messages.
  const INVALID_MSG = 'Invalid email or password';

  const existing = await checkuserExist(email);
  if (!existing) {
    const err = new Error(INVALID_MSG);
    err.status = 401; throw err;
  }

  const match = await bcrypt.compare(password, existing.password);
  if (!match) {
    const err = new Error(INVALID_MSG);
    err.status = 401; throw err;
  }

  const token = jwt.sign(
    { id: existing.id, role: existing.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const user = await getUserById(existing.id);
  return { token, user };
};
