// src/component/NavBar.jsx
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function NavBar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.', {
      position: 'top-right',
      autoClose: 3000,
    });
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Car Rental Service - Car Prime</h2>
      </div>
      <div className="navbar-links">
        <button
          className="navbar-button"
          onClick={() => navigate('/HomeUser')}
        >
          Home
        </button>
        {user ? (
          <>
            <span className="navbar-user">Hello, {user.name || user.email}!</span>
            <button
              className="navbar-button"
              onClick={() => navigate('/myrented')}
            >
              My Rented
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate('/rent')}
            >
              Rent Car
            </button>
            {user.isWorker && (
              <button
                className="navbar-button"
                onClick={() => navigate('/worker')}
              >
                Accept Returns - Worker
              </button>
            )}
            <button
              className="navbar-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="navbar-button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
