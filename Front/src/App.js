// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/NavBar';
import ProtectedRoute from './component/ProtectedRoute';
import HomePage from './component/HomePage';
import ReturnsPage from './component/ReturnsPage';
import LoginPage from './component/LoginPage';
import './styles/App.css'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <Router>
      {/*  */}
      <Navbar isAuthenticated={isAuthenticated} logout={logout} />
      
      <Routes>
        {/* */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        {/**/}
        <Route 
          path="/returns" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ReturnsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* */}
        <Route 
          path="/login" 
          element={
            <LoginPage 
              login={login} 
              isAuthenticated={isAuthenticated} 
            />
          } 
        />
        
        {/* */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
