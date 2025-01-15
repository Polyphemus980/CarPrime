// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './context/UserContext';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="847934116290-srh43sv05kgb7nctnfifoocekfaf8kqn.apps.googleusercontent.com">
      <UserProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
