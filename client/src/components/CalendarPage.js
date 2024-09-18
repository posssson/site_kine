// client/src/components/CalendarPage.js
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './Generalcss.css'; // Assurez-vous d'avoir un fichier CSS pour le style

const apiUrl = process.env.REACT_APP_API_URL;

const CalendarWrapper = ({ onChange, value }) => {
  return <Calendar onChange={onChange} value={value} />;
};

const CalendarPage = ({ patients }) => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ patientId: '', description: '', time: '' });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${apiUrl}}/api/appointments`);
        console.log('Rendez-vous reçus:', response.data); // Vérifiez les données ici
        setAppointments(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous', error);
      }
    };
    fetchAppointments();
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}}/api/appointments`, {
        ...newAppointment,
        date: date.toISOString().split('T')[0], // Format de la date
      });
      setAppointments([...appointments, response.data]);
      setNewAppointment({ patientId: '', description: '', time: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rendez-vous', error);
    }
  };

  const appointmentsForDate = appointments.filter(
    (appointment) => new Date(appointment.date).toDateString() === date.toDateString()
  );

  return (
    <div>
      <h2>Calendrier des Patients</h2>
      <CalendarWrapper onChange={handleDateChange} value={date} />
      <h3>Rendez-vous pour le {date.toDateString()}</h3>
      <ul>
        {appointmentsForDate.map((appointment) => (
          <li key={appointment._id}>
            {appointment.patientId?.name || 'Nom non disponible'} - {appointment.description || 'Pas de description'} à {appointment.date || 'Heure non spécifiée'}
          </li>
        ))}
      </ul>
      <h3>Ajouter un Rendez-vous</h3>
      <form onSubmit={handleAddAppointment}>
        <select
          name="patientId"
          value={newAppointment.patientId}
          onChange={handleInputChange}
          required
        >
          <option value="">Sélectionner un patient</option>
          {patients && patients.length > 0 ? (
            patients.map(patient => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))
          ) : (
            <option disabled>Aucun patient disponible</option>
          )}
        </select>
        <input
          type="time"
          name="time"
          value={newAppointment.time}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newAppointment.description}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default CalendarPage;
