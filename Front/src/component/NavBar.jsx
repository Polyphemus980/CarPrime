// src/component/NavBar.jsx
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './NavBar.css';
import { useNavigate, Link } from 'react-router-dom';
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
        <Link to="/HomeUser">
          <button className="navbar-button">Home</button>
        </Link>
        {user ? (
          <>
            <span className="navbar-user">Hello, {user.name || user.email}!</span>
            <Link to="/myrented">
              <button className="navbar-button">My Rented</button>
            </Link>
            <Link to="/rent">
              <button className="navbar-button">Rent Car</button>
            </Link>
            {user.isWorker && (
              <Link to="/worker">
                <button className="navbar-button">Accept Returns - Worker</button>
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

export default NavBar;
