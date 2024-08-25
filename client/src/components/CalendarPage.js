// client/src/components/CalendarPage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

const CalendarWrapper = ({ onChange, value }) => {
  return <Calendar onChange={onChange} value={value} />;
};

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

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
            {appointment.patientId.name} - {appointment.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarPage;
