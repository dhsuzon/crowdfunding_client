'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from '@/lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access-token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch { }
    }
    setLoading(false);
  }, []);

  const saveAuth = useCallback((token, userData) => {
    localStorage.setItem('access-token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const register = useCallback(async (data) => {
    try {
      const res = await axios.post('/auth/register', data);
      saveAuth(res.data.token, res.data.user);
      toast.success('Registration successful!');
      return res.data;
    } catch (err) {
      throw err;
    }
  }, [saveAuth]);

  const login = useCallback(async (data) => {
    try {
      const res = await axios.post('/auth/login', data);
      saveAuth(res.data.token, res.data.user);
      toast.success('Login successful!');
      return res.data;
    } catch (err) {
      throw err;
    }
  }, [saveAuth]);

  const googleLogin = useCallback(async (data) => {
    try {
      const res = await axios.post('/auth/google', data);
      saveAuth(res.data.token, res.data.user);
      toast.success('Google login successful!');
      return res.data;
    } catch (err) {
      throw err;
    }
  }, [saveAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out');
  }, []);

  const updateUserCredits = useCallback((credits) => {
    setUser((prev) => {
      const updated = { ...prev, credits };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout, updateUserCredits }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
