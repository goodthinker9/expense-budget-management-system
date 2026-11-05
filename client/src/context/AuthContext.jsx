import { useState, createContext, useEffect } from 'react';
import api from '../services/app';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only attempt /me if a token is present in localStorage
    const token = localStorage.getItem('token');

    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
