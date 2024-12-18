// src/App.jsx

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/NavBar';
import LoginPage from './component/LoginPage';
import HomePage from './component/HomePage';
import ReturnsPage from './component/ReturnsPage';
import { UserContext } from './context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/rent"
          element={user ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/return"
          element={user ? <ReturnsPage /> : <Navigate to="/login" replace />}
        />
        {/*  */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
