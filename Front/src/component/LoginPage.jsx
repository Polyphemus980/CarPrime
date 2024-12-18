// src/components/LoginPage.jsx

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import './LoginPage.css';

function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSwitchToRegister = () => {
    setIsRegistering(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegistering(false);
  };

  return (
    <div className="login-page-container">
      {!isRegistering ? (
        <div className="login-form-wrapper">
          <LoginForm />
          <p className="switch-text">
            Don't have an account?{' '}
            <button className="switch-button" onClick={handleSwitchToRegister}>
              Register Here
            </button>
          </p>
        </div>
      ) : (
        <div className="registration-form-wrapper">
          <RegistrationForm onSwitchToLogin={handleSwitchToLogin} />
        </div>
      )}
    </div>
  );
}

export default LoginPage;
