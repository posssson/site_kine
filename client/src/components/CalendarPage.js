// client/src/components/CalendarPage.js
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

const CalendarWrapper = ({ onChange, value }) => {
  return <Calendar onChange={onChange} value={value} />;
};

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ patientName: '', description: '' });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://192.168.0.18:5000/api/appointments');
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
      const response = await axios.post('http://192.168.0.18:5000/api/appointments', {
        ...newAppointment,
        date,
      });
      setAppointments([...appointments, response.data]);
      setNewAppointment({ patientName: '', description: '' });
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
            {appointment.patientName} - {appointment.description}
          </li>
        ))}
      </ul>
      <h3>Ajouter un Rendez-vous</h3>
      <form onSubmit={handleAddAppointment}>
        <input
          type="text"
          name="patientName"
          placeholder="Nom du patient"
          value={newAppointment.patientName}
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
