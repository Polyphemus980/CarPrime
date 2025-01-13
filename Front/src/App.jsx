// src/App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './component/NavBar';
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
import LandingPage from './component/LandingPage';

function App() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <NavBar />
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/HomeUser"
          element={user ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/login"
          element={!user ? <LoginForm /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/register"
          element={!user ? <RegistrationForm /> : <Navigate to="/HomeUser" replace />}
        />
        <Route
          path="/return"
          element={user ? <ReturnsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/worker"
          element={
            user && user.isWorker ? <WorkerDashboard /> : <Navigate to="/HomeUser" replace />
          }
        />
        <Route
          path="/rent"
          element={user ? <RentCar /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/myrented"
          element={user ? <MyRented /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/HomeUser" : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
