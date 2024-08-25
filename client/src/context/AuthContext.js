// client/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer un contexte pour l'authentification
const AuthContext = createContext();

// Fournisseur de contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Vérifier si un jeton est déjà stocké dans le localStorage
    const token = localStorage.getItem('authToken');
    return token ? true : false;
  });

  // Fonction pour gérer la connexion
  const login = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    }
    setIsAuthenticated(true);
  };

  // Fonction pour gérer la déconnexion
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  // Vérifier l'expiration du jeton
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simuler une expiration de 10 minutes
      const expirationTime = 10 * 60 * 1000; // 10 minutes
      const timer = setTimeout(() => {
        logout();
      }, expirationTime);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);
