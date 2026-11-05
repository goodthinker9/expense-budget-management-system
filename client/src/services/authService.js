import api from "./app.js";

/**
 * POST /api/auth/login
 * Returns the axios response.data, which has the shape:
 *   { message: string, data: { token: string, user: object } }
 * Callers should read token/user from .data.token / .data.user,
 * with a fallback to the top level for forward-compatibility.
 */
export const login = async (userData) => {
  try {
    const response = await api.post("/api/auth/login", userData);
    return response.data; // { message, data: { token, user } }
  } catch (error) {
    console.error('Login error:', error?.response?.data);
    throw error;
  }
};

/**
 * POST /api/auth/register
 * Returns the axios response.data, same shape as login:
 *   { message: string, data: { token: string, user: object } }
 */
export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data; // { message, data: { token, user } }
  } catch (error) {
    console.error('Register error:', error?.response?.data);
    throw error;
  }
};
