// client/src/components/Dashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CalendarPage from './CalendarPage';
import './Generalcss.css';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', pathology: '' });
  const [pathologies, setPathologies] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Utilisation de useCallback pour mémoriser ces fonctions
  const fetchPatients = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/patients`);
      setPatients(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des patients', error);
    }
  }, []);

  const fetchPathologies = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pathologies`);
      setPathologies(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des pathologies', error);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    fetchPathologies();
  }, [fetchPatients, fetchPathologies]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.pathology) {
      console.error('Le nom du patient et la pathologie doivent être renseignés.');
      return;
    }
    try {
      const selectedPathology = pathologies.find(p => p._id === newPatient.pathology);
      if (!selectedPathology) {
        console.error('Pathologie sélectionnée invalide.');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/patients`, {
        name: newPatient.name,
        pathology: selectedPathology._id
      });

      setPatients(prevPatients => [...prevPatients, response.data]);
      setNewPatient({ name: '', pathology: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du patient', error);
    }
  };

  return (
    <div className="container">
      <h2>Gestion de Compte</h2>
      <button className="add-button" onClick={handleLogout}>Se déconnecter</button>
      <nav>
        <ul>
          <li><Link to="/pathologies">Ajouter Pathologie</Link></li>
          <li><Link to="/exercises">Exercices par Pathologie</Link></li>
          <li><Link to="/assign-exercises">Attribuer des Exercices</Link></li>
        </ul>
      </nav>
      <h3>Liste des Patients</h3>
      {patients.length === 0 ? (
        <p>Aucun patient à afficher.</p>
      ) : (
        <ul>
          {patients.map(patient => (
            <li key={patient._id}>
              {patient.name} - {patient.pathology.name}
            </li>
          ))}
        </ul>
      )}
      <h3>Ajouter un Nouveau Patient</h3>
      <form onSubmit={handleAddPatient}>
        <input
          type="text"
          placeholder="Nom"
          value={newPatient.name}
          onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
        />
        <select
          value={newPatient.pathology}
          onChange={(e) => setNewPatient(prev => ({ ...prev, pathology: e.target.value }))}
        >
          <option value="">Sélectionner une pathologie</option>
          {pathologies.map(pathology => (
            <option key={pathology._id} value={pathology._id}>{pathology.name}</option>
          ))}
        </select>
        <button className="add-button" type="submit">Ajouter</button>
      </form>
      <CalendarPage patients={patients} />
    </div>
  );
};

export default Dashboard;