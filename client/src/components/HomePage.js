// client/src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Generalcss.css'; // Assurez-vous d'avoir un fichier CSS pour le style

const HomePage = () => {
  return (
    <div>
      <h1>Bienvenue sur notre site</h1>
      <nav>
        <ul>
          <li><Link to="/login">Se connecter</Link></li>
          <li><Link to="/signup">S'inscrire</Link></li>
          {/* Ajoutez d'autres liens ici pour les futures pages */}
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;