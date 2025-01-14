// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/NavBar';
import ProtectedRoute from './component/ProtectedRoute';
import HomePage from './component/HomePage';
import ReturnsPage from './component/ReturnsPage';
import LoginPage from './component/LoginPage';
import RegisterPage from './component/RegisterPage';
import MyRented from './component/MyRented'; 
import RentCar from './component/RentCar'; 
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
      <Navbar isAuthenticated={isAuthenticated} logout={logout} />
      
      <Routes>
        {/* Home Page - Protected Route */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Returns Page - Protected Route */}
        <Route 
          path="/returns" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ReturnsPage />
            </ProtectedRoute>
          } 
        />

        {/* My Rented Page - Protected Route */}
        <Route 
          path="/myrented" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MyRented />
            </ProtectedRoute>
          } 
        />

        {/* Rent Car Page - Protected Route */}
        <Route 
          path="/rent" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RentCar />
            </ProtectedRoute>
          } 
        />

        {/* Register Page - Public Route */}
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
          } 
        />
        
        {/* Login Page - Public Route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage login={login} />
          } 
        />
        
        {/* Catch-All Route - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
