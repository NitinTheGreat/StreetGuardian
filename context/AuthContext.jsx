'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    const storedUserToken = localStorage.getItem('token');
    const storedAdminToken = localStorage.getItem('adminToken');
    if (storedUserToken) setUserToken(storedUserToken);
    if (storedAdminToken) setAdminToken(storedAdminToken);
  }, []);

  const login = useCallback((token) => {
    setUserToken(token);
    localStorage.setItem('token', token);
  }, []);

  const adminLogin = useCallback((token) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
  }, []);

  const logout = useCallback(() => {
    setUserToken(null);
    localStorage.removeItem('token');
  }, []);

  const adminLogout = useCallback(() => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, adminToken, login, adminLogin, logout, adminLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

