import api from "./app.js";

export const login = async (userData) => {
  try {
    const response = await api.post("/api/auth/login", userData);
    // Returns the full response.data object { token, user }
    return response.data;
  } catch (error) {
    console.error('Login error:', error?.response?.data);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error('Register error:', error?.response?.data);
    throw error;
  }
};
