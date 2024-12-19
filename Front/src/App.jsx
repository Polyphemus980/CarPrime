// src/App.jsx

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/NavBar';
import LoginForm from './component/LoginForm';
import RegistrationForm from './component/RegistrationForm';
import HomePage from './component/HomePage';
import ReturnsPage from './component/ReturnsPage';
import WorkerDashboard from './component/WorkerDashboard';
import RentCar from './component/RentCar'; 
import { UserContext } from './context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyRented from './component/MyRented';

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
          element={!user ? <LoginForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <RegistrationForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/return"
          element={user ? <ReturnsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/worker"
          element={
            user && user.isWorker ? <WorkerDashboard /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/rent"
          element={user ? <RentCar /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/myrented"
          element={user ? <MyRented /> : <Navigate to="/myrented" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
