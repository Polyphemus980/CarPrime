// src/context/UserContext.jsx
import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const isWorker = decoded.sub === 'jangaska00@gmail.com';
        return {
          email: decoded.sub,
          token: storedToken,
          isWorker: isWorker,
        };
      } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
      }
    }
    return null;
  });

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      const email = decoded.sub;
      const isWorker = email === 'jangaska00@gmail.com';
      const userData = {
        email,
        token,
        isWorker,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
