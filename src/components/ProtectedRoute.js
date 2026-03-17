import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. If not logged in at all, kick them to login
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // 2. If their role isn't in the "Allowed" list, kick them to a safe page
  if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
    return <Navigate to="/records" />; // Or an "Unauthorized" page
  }

  // 3. If everything is fine, let them in!
  return children;
};

export default ProtectedRoute;