// client/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des patients', error);
      }
    };

    fetchPatients();
  }, []);

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
      <h3>Liste des Patients</h3>
      <ul>
        {patients.map(patient => (
          <li key={patient._id}>{patient.name} - {patient.pathology}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
