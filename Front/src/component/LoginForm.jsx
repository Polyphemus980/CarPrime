// src/components/LoginForm.jsx

import React, { useState, useContext, useEffect } from 'react';
import './LoginForm.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';

function LoginForm() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const specialWorkerEmail = 'jangaska00@gmail.com';

  const handleGoogleLogin = (response) => {
    setSubmitting(true);
    const idToken = response.credential;
    axios.post('./api/Auth/authenticate', { IdToken: idToken })
      .then(res => {
        if (res.data.requiresAdditionalInfo) {
          navigate(`/register?email=${res.data.email}`);
        } else {
          const isWorker = res.data.email.toLowerCase() === specialWorkerEmail;
          const userData = {
            token: res.data.Token,
            name: res.data.name || res.data.email,
            email: res.data.email,
            isWorker,
          };
          login(userData);
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        toast.error('Google Login failed', { position: 'top-right', autoClose: 5000 });
      })
      .finally(() => setSubmitting(false));
  };

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
    axios.post('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/api/Auth/authenticate', { email, password })
      .then(res => {
        if (res.data.requiresAdditionalInfo) {
          navigate(`./register?email=${res.data.email}`);
        } else {
          const isWorker = email.toLowerCase() === specialWorkerEmail;
          const userData = {
            token: res.data.Token,
            name: res.data.name || email,
            email: email,
            isWorker,
          };
          login(userData);
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        toast.error('Login failed', { position: 'top-right', autoClose: 5000 });
      })
      .finally(() => setSubmitting(false));
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
          client_id: '847934116290-srh43sv05kgb7nctnfifoocekfaf8kqn.apps.googleusercontent.com',
          callback: handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          { theme: 'outline', size: 'large' }
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //eslint-disable-next-line react-hooks/exhaustive-deps

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
