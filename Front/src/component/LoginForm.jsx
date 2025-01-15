// src/component/LoginForm.jsx
import React, { useContext, useState } from 'react';
import './LoginForm.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../axiosConfig';

function LoginForm() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      setSubmitting(true);
      try {
        const response = await axiosInstance.post('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/auth/authenticate', {
          IdToken: credentialResponse.credential,
        });

        const { Token } = response.data;
        login(Token);
        toast.success('Logged in with Google successfully!', { position: 'top-right', autoClose: 3000 });
        navigate('/');
      } catch (error) {
        console.error('Google Authentication error:', error);
        toast.error('Google Sign-In failed.', { position: 'top-right', autoClose: 5000 });
      } finally {
        setSubmitting(false);
      }
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
      {false && (
        <form /* onSubmit={handleEmailLogin} */ noValidate>
          {/* Email and Password Fields */}
          {/* Implement when backend supports email/password authentication */}
        </form>
      )}
    </div>
  );
}

export default LoginForm;
