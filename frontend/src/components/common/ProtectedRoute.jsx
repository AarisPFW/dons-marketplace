// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/student/signin" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const dashboard = user.role === 'student' ? '/student/dashboard' : '/seller/dashboard';
    return <Navigate to={dashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;