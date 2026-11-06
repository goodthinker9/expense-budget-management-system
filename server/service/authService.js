import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkuserExist, registerUserModel, getUserById } from '../model/authModel.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerService = async (data) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    const err = new Error('name, email and password are required');
    err.status = 400; throw err;
  }
  if (!EMAIL_RE.test(email)) {
    const err = new Error('Invalid email format');
    err.status = 400; throw err;
  }
  if (password.length < 6) {
    const err = new Error('Password must be at least 6 characters');
    err.status = 400; throw err;
  }

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

export const loginService = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400; throw err;
  }
  if (!EMAIL_RE.test(email)) {
    const err = new Error('Invalid email format');
    err.status = 400; throw err;
  }

  const existing = await checkuserExist(email);
  if (!existing) {
    const err = new Error('Invalid email or password');
    err.status = 401; throw err;
  }

  const match = await bcrypt.compare(password, existing.password);
  if (!match) {
    const err = new Error('Invalid email or password');
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
