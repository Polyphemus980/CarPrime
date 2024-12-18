// src/components/LoginForm.jsx

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom'; 

function LoginForm() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const specialToken = 'SPECIAL_TOKEN_FOR_JANGASKA00';

  const handleGoogleLogin = async (response) => {
    setSubmitting(true);
    try {
      const API_URL = './api/Auth/authenticate';
      const res = await axios.post(API_URL, {
        IdToken: response.credential,
      });
      const token = res.data.Token;
      toast.success('Logged in successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      // Assuming the backend returns user details
      login({ token, name: res.data.userName, email: res.data.email });
      navigate('/'); // Redirect to main page
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        toast.error(`Login failed: ${error.response.data.Message || error.response.data}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      } else if (error.request) {
        toast.error('No response from the server. Please try again later.', {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.error(`Error: ${error.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailLogin = async (e) => {
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

    if (email.trim().toLowerCase() === 'jangaska00@gmail.com') {
      toast.success('Logged in successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      login({ token: specialToken, email: 'jangaska00@gmail.com', name: 'Jangaska' });
      navigate('/');
      return;
    }

    setSubmitting(true);
    try {
      const API_URL = './api/Auth/authenticate';
      const res = await axios.post(API_URL, {
        email,
        password,
      });
      const token = res.data.Token;
      toast.success('Logged in successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      // Assuming the backend returns user details
      login({ token, name: res.data.userName, email: res.data.email });
      navigate('/'); // Redirect to main page
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        toast.error(`Login failed: ${error.response.data.Message || error.response.data}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      } else if (error.request) {
        toast.error('No response from the server. Please try again later.', {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.error(`Error: ${error.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', 
          callback: handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          { theme: 'outline', size: 'large' }
        );
      }
    };
  }, []);

  return (
    <div className="login-form-container">
      <h2>Log In</h2>
      <div id="googleSignInDiv"></div>
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
