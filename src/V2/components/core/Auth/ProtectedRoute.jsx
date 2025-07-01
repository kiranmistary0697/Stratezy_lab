import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom'; // For redirection (React Router)
import routes from '../../../constants/Routes';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // To save the current location for redirection after signin

  if (!isAuthenticated) {
    // Redirect to a signin page and pass the current location in state for post-signin redirection
    return <Navigate to={routes.signin} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
