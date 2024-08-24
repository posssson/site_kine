// client/src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Créer un contexte pour l'authentification
const AuthContext = createContext();

// Fournisseur de contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simuler une connexion
  const login = () => setIsAuthenticated(true);

  // Simuler une déconnexion
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);
