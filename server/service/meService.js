import {
  getUserByIdModel,
  updateUserModel,
  updatePasswordModel,
  getPasswordHash,
  emailTakenByOther,
} from '../model/meModel.js';
import bcrypt from 'bcrypt';

export const getMeService = async (userId) => {
  const user = await getUserByIdModel(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404; throw err;
  }
  return user;
};

export const updateMeService = async (userId, { name, email }) => {
  if (!name || !email) {
    const err = new Error('name and email are required');
    err.status = 400; throw err;
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(email)) {
    const err = new Error('Invalid email format');
    err.status = 400; throw err;
  }

  const taken = await emailTakenByOther(email, userId);
  if (taken) {
    const err = new Error('Email is already in use by another account');
    err.status = 409; throw err;
  }

  const user = await updateUserModel(userId, name, email);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404; throw err;
  }
  return user;
};

export const changePasswordService = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    const err = new Error('currentPassword and newPassword are required');
    err.status = 400; throw err;
  }
  if (newPassword.length < 6) {
    const err = new Error('New password must be at least 6 characters');
    err.status = 400; throw err;
  }

  const hash = await getPasswordHash(userId);
  if (!hash) {
    const err = new Error('User not found');
    err.status = 404; throw err;
  }

  const match = await bcrypt.compare(currentPassword, hash);
  if (!match) {
    const err = new Error('Current password is incorrect');
    err.status = 401; throw err;
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await updatePasswordModel(userId, newHash);
};
