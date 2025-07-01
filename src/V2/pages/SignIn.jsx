import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the redirect location from state, or default to home
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!isAuthenticated) {
      login(); // Trigger Keycloak login
    } else {
      navigate(from, { replace: true }); // Redirect to the intended page
    }
  }, [isAuthenticated, login, from, navigate]);

  return <p>Redirecting to login...</p>; // Optional loading message
};

export default SignIn;
