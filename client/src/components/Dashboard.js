// client/src/components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h2>Gestion de Compte</h2>
      <nav>
        <ul>
          <li><Link to="/calendar">Calendrier des Patients</Link></li>
          <li><Link to="/exercises">Exercices par Pathologie</Link></li>
          <li><Link to="/assign-exercises">Attribuer des Exercices</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
