// client/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CalendarPage from './CalendarPage'; // Importer le composant CalendarPage

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', pathology: '' });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://192.168.0.18:5000/api/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des patients', error);
      }
    };

    fetchPatients();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.0.18:5000/api/patients', newPatient);
      setPatients([...patients, response.data]);
      setNewPatient({ name: '', pathology: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du patient', error);
    }
  };

  return (
    <div>
      <h2>Gestion de Compte</h2>
      <button onClick={handleLogout}>Se déconnecter</button>
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
      <h3>Ajouter un Nouveau Patient</h3>
      <form onSubmit={handleAddPatient}>
        <input
          type="text"
          placeholder="Nom"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Pathologie"
          value={newPatient.pathology}
          onChange={(e) => setNewPatient({ ...newPatient, pathology: e.target.value })}
        />
        <button type="submit">Ajouter</button>
      </form>
      <CalendarPage patients={patients} /> {/* Passer les patients à CalendarPage */}
    </div>
  );
};

export default Dashboard;
