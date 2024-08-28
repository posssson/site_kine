// client/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Assurez-vous d'ajouter un fichier CSS pour le style

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Mon Application</h1>
      <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/calendar">Calendrier</Link></li>
        <li><Link to="/pathologies">Pathologies</Link></li>
        <li><Link to="/exercises">Exercices</Link></li>
        <li><Link to="/assign-exercises">Assigner exercices</Link></li>
        
      </ul>
    </nav>
  );
};

export default Navbar;
