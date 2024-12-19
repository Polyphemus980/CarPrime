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

  useEffect(() => {
    const initializeGapi = () => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: '847934116290-srh43sv05kgb7nctnfifoocekfaf8kqn.apps.googleusercontent.com',
          }).then(() => {
            renderGoogleSignInButton();
          }).catch((error) => {
            console.error('Error initializing Google Auth:', error);
          });
        });
      } else {
        console.error('GAPI not loaded');
      }
    };

    const renderGoogleSignInButton = () => {
      if (window.gapi && window.gapi.auth2) {
        window.gapi.signin2.render('googleSignInButton', {
          scope: 'profile email',
          width: 240,
          height: 50,
          longtitle: true,
          theme: 'dark',
          onsuccess: onGoogleSignInSuccess,
          onfailure: onGoogleSignInFailure,
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initializeGapi(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onGoogleSignInSuccess = (googleUser) => {
    const idToken = googleUser.getAuthResponse().id_token;
    console.log('Google idToken:', idToken);  

    handleGoogleLogin(idToken);
  };

  const onGoogleSignInFailure = (error) => {
    console.error('Google Sign-In Error:', error);
    toast.error('Google Sign-In failed', { position: 'top-right', autoClose: 5000 });
  };

  const handleGoogleLogin = async (idToken) => {
    setSubmitting(true);
    try {
      const res = await axios.post('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/api/Auth/register', { IdToken: idToken });

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
        console.log('Received Token:', res.data.Token); 
      }
    } catch (error) {
      console.error('Google Login error:', error);
      toast.error('Google Login failed', { position: 'top-right', autoClose: 5000 });
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

    setSubmitting(true);
    try {
      const res = await axios.post('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/api/Auth/register', { email, password });

      if (res.data.requiresAdditionalInfo) {
        navigate(`/register?email=${res.data.email}`);
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
        console.log('Received Token:', res.data.Token);
      }
    } catch (error) {
      console.error('Email Login error:', error);
      toast.error('Login failed', { position: 'top-right', autoClose: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Log In</h2>
      
      {}
      <div id="googleSignInButton"></div>
      
      <div className="separator">OR</div>
      
      {}
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
