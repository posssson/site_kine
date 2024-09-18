// client/src/components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Generalcss.css'; // Assurez-vous d'avoir un fichier CSS pour le style

const apiUrl = process.env.REACT_APP_API_URL;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        console.log('Connexion réussie!');
        const token = response.data.token;
        login(token);
        navigate('/dashboard'); // Assurez-vous que la redirection est correcte
      } else {
        alert(response.data.message || 'Mauvais mot de passe!');
      }
    } catch (error) {
      alert('Erreur lors de la connexion');
      console.error('Erreur lors de la connexion', error);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default LoginPage;
