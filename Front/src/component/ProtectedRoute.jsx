// src/component/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(UserContext);

  if (!user) {
    // User is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'worker' && !user.isWorker) {
    // User does not have the required role
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
