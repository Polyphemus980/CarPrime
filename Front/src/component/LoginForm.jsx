// src/component/LoginForm.jsx
import React, { useState, useContext } from 'react';
import './LoginForm.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

function LoginForm() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEmailLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    const { email, password } = formData;

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      newErrors.email = 'Invalid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    // Bypass authentication and log in the user directly
    const userData = {
      token: 'dummy-token',
      name: formData.email.split('@')[0],
      email: formData.email,
      isWorker: false, // Set to true if needed
    };
    login(userData);
    toast.success('Logged in successfully!', { position: 'top-right', autoClose: 3000 });
    navigate('/HomeUser');
    setSubmitting(false);
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      setSubmitting(true);
      // Bypass authentication and log in the user directly
      const userData = {
        token: credentialResponse.credential,
        name: 'Google User',
        email: 'googleuser@example.com',
        isWorker: false, // Set to true if needed
      };
      login(userData);
      toast.success('Logged in with Google successfully!', { position: 'top-right', autoClose: 3000 });
      navigate('/HomeUser');
      setSubmitting(false);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Sign-In Error:', error);
    toast.error('Google Sign-In failed', { position: 'top-right', autoClose: 5000 });
  };

  return (
    <div className="login-form-container">
      <h2>Log In</h2>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginFailure}
      />
      <div className="separator">OR</div>
      <form onSubmit={handleEmailLogin} noValidate>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </label>

        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
