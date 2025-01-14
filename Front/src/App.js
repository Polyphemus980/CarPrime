// src/App.js
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/NavBar';
import ProtectedRoute from './component/ProtectedRoute';
import HomePage from './component/HomePage';
import ReturnsPage from './component/ReturnsPage';
import LoginPage from './component/LoginPage';
import RegisterPage from './component/RegisterPage';
import MyRented from './component/MyRented'; 
import RentCar from './component/RentCar'; 
import WorkerPage from './component/WorkerPage';
import { UserProvider } from './context/UserContext';
import './styles/App.css'; 

function App() {
  return (
    <UserProvider>
      <GoogleOAuthProvider clientId="847934116290-srh43sv05kgb7nctnfifoocekfaf8kqn.apps.googleusercontent.com" referrerPolicy="strict-origin-when-cross-origin">
        <Router>
          <Navbar />
          
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/returns" 
              element={
                <ProtectedRoute>
                  <ReturnsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/myrented" 
              element={
                <ProtectedRoute>
                  <MyRented />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rent" 
              element={
                <ProtectedRoute>
                  <RentCar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worker" 
              element={
                <ProtectedRoute requiredRole="worker">
                  <WorkerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register" 
              element={<RegisterPage />} 
            />
            <Route 
              path="/login" 
              element={<LoginPage />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </UserProvider>
  );
}

export default App;
