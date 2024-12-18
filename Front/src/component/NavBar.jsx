// src/components/Navbar.jsx

import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './NavBar.css';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Navbar() {
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
        <h2>Car Rental Service</h2>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">Hello, {user.name || user.email}!</span>
            <Link to="/">
              <button className="navbar-button">Rent Car</button>
            </Link>
            {user.isWorker && (
              <Link to="/worker">
                <button className="navbar-button">Worker Dashboard</button>
              </Link>
            )}
            <button className="navbar-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="navbar-button" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="navbar-button" onClick={() => navigate('/register')}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
