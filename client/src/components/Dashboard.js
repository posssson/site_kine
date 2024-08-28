// client/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CalendarPage from './CalendarPage';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', pathology: '' });
  const [pathologies, setPathologies] = useState([]);
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

    const fetchPathologies = async () => {
      try {
        const response = await axios.get('http://192.168.0.18:5000/api/pathologies');
        setPathologies(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des pathologies', error);
      }
    };

    fetchPatients();
    fetchPathologies();
  }, []);

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
      // Ensure the pathology is an ObjectId
      const selectedPathology = pathologies.find(p => p._id === newPatient.pathology);
      if (!selectedPathology) {
        console.error('Pathologie sélectionnée invalide.');
        return;
      }

      const response = await axios.post('http://192.168.0.18:5000/api/patients', {
        name: newPatient.name,
        pathology: selectedPathology._id // Use the ObjectId
      });

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
          {/* <li><Link to="/calendar">Calendrier des Patients</Link></li> */}
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
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
        />
        <select
          value={newPatient.pathology}
          onChange={(e) => setNewPatient({ ...newPatient, pathology: e.target.value })}
        >
          <option value="">Sélectionner une pathologie</option>
          {pathologies.length === 0 ? (
            <option disabled>Aucune pathologie disponible</option>
          ) : (
            pathologies.map(pathology => (
              <option key={pathology._id} value={pathology._id}>{pathology.name}</option>
            ))
          )}
        </select>
        <button type="submit">Ajouter</button>
      </form>
      <CalendarPage patients={patients || []} />
    </div>
  );
};

export default Dashboard;
