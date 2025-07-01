import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Logout = () => {
  const { handleLogout } = useAuth();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <p>Logging out...</p>; // You can show a loading message or spinner while logging out
};

export default Logout;
