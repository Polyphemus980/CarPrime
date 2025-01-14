// src/component/LandingPage.jsx
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './LandingPage.css';

function LandingPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/HomeUser');
    }
  }, [user, navigate]);

  return (
    <div className="landing-page-container">
      <h1>Welcome to Car Prime!</h1>
      <p>Your trusted partner for car rentals.</p>
      <div className="landing-buttons">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
}


export default LandingPage;
