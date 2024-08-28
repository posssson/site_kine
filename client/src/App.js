// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import CalendarPage from './components/CalendarPage';
import Pathologies from './components/Pathologies';
import Exercices from './components/Exercices';
import { AuthProvider, useAuth } from './context/AuthContext';
import axios from 'axios';

// Configure Axios pour inclure les cookies dans chaque requête
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
          <Route path="/calendar" element={<PrivateRoute component={CalendarPage} />} />
          <Route path="/pathologies" element={<PrivateRoute  component={Pathologies} />} />
          <Route path="/exercises" element={<PrivateRoute  component={Exercises} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Composant de route privée
const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default App;
