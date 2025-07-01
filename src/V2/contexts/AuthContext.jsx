import React, { createContext, useState, useEffect, useContext } from "react";
import keycloakInstance from "../config/keycloak";
import { checkFirstTimeLogin } from "../services/api/authApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import routes from "../constants/Routes";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let refreshInterval;

    const initializeKeycloak = async () => {
      try {
        if (initialized) return; // Prevent re-initialization

        const auth = await keycloakInstance.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
        });

        console.log("Keycloak initialization result:", auth);

        if (auth) {
          const tokenData = keycloakInstance.tokenParsed || {};
          // console.log('Token Data:', tokenData);

          setIsAuthenticated(true);
          setAuthToken(keycloakInstance.token);
          setUser(tokenData);

          localStorage.setItem("authToken", keycloakInstance.token);

          // Set Authorization header for Axios
          //axios.defaults.headers['Authorization'] = `Bearer ${keycloakInstance.token}`;

          // Refresh token periodically
          refreshInterval = setInterval(() => {
            //console.log('Attempting token refresh...');
            keycloakInstance
              .updateToken(30)
              .then((refreshed) => {
                //console.log('Refreshed status:', refreshed);
                if (refreshed) {
                  console.log("Token successfully refreshed");
                  setAuthToken(keycloakInstance.token);
                  //axios.defaults.headers['Authorization'] = `Bearer ${keycloakInstance.token}`;

                  localStorage.setItem("authToken", keycloakInstance.token);
                }
              })
              .catch((error) => {
                console.error("Failed to refresh token:", error);
                logout();
              });
          }, 60000);

          // Check if the user is logging in for the first time
          try {
            const response = await checkFirstTimeLogin(keycloakInstance.token);
            //console.log('First-time login check response:', response);
            if (response.firstTimeLogin) {
              navigate(routes.additionalDetails);
            }
          } catch (error) {
            console.error("Error during first-time login check:", error);
          }
        } else {
          console.log("User is not authenticated");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Keycloak initialization failed:", error);
        setIsAuthenticated(false);
      } finally {
        setInitialized(true); // Ensure initialization state is set
      }
    };

    initializeKeycloak();

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const login = () => {
    console.log("Redirecting to Keycloak login...");
    keycloakInstance.login({
      redirectUri: `${window.location.origin}/app`,
    });
  };

  const handleLogout = () => {
    const redirectUri = `${window.location.origin}${routes.homepage}`;
    keycloakInstance.logout({ redirectUri }).catch(() => {
      console.error("Failed to logout from Keycloak");
      window.location.href = redirectUri; // Fallback redirect
    });

    // Clear Axios headers
    delete axios.defaults.headers["Authorization"];

    // Reset application state
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem("authToken");
  };

  const logout = () => navigate(routes.logout);

  const getAccessToken = () => keycloakInstance.token || null;

  const getRefreshToken = () => keycloakInstance.refreshToken || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        isAuthenticated,
        initialized,
        login,
        logout,
        handleLogout,
        getAccessToken,
        getRefreshToken,
      }}
    >
      {initialized ? children : <div>Loading...</div>}{" "}
      {/* Render a loader until initialization */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
