// client/src/components/SignupPage.js
import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        email,
        password,
      });
      alert('Compte créé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création du compte', error);
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
