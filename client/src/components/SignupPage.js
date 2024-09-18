// client/src/components/SignupPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './Generalcss.css'; // Assurez-vous d'avoir un fichier CSS pour le style

const apiUrl = process.env.REACT_APP_API_URL;

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}}/signup`, {
        email,
        password,
      });
      alert('Compte créé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création du compte', error);
      alert('Erreur lors de la création du compte');
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSignup}>
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
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default SignupPage;
