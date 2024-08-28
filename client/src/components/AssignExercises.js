// client/src/components/AssignExercises.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignExercises = () => {
  const [appointments, setAppointments] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    // Charger les rendez-vous et les exercices depuis l'API
    const fetchData = async () => {
      try {
        const appointmentsResponse = await axios.get('http://192.168.0.18:5000/api/appointments');
        const exercisesResponse = await axios.get('http://192.168.0.18:5000/api/exercises');
        setAppointments(appointmentsResponse.data);
        setExercises(exercisesResponse.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      }
    };

    fetchData();
  }, []);

  const handleAssignExercises = async () => {
    try {
      await axios.post(`http://192.168.0.18:5000/api/assign-exercises`, {
        appointmentId: selectedAppointment,
        exercises: selectedExercises,
      });
      alert('Exercices attribués avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'attribution des exercices', error);
    }
  };

  return (
    <div>
      <h2>Attribuer des Exercices</h2>
      <div>
        <h3>Sélectionnez un Rendez-vous</h3>
        <ul>
          {appointments.map(appointment => (
            <li key={appointment.id} onClick={() => setSelectedAppointment(appointment.id)}>
              {appointment.date} - {appointment.patientName}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Sélectionnez des Exercices</h3>
        <ul>
          {exercises.map(exercise => (
            <li key={exercise.id}>
              <input
                type="checkbox"
                value={exercise.id}
                onChange={(e) => {
                  const exerciseId = e.target.value;
                  setSelectedExercises(prev =>
                    prev.includes(exerciseId)
                      ? prev.filter(id => id !== exerciseId)
                      : [...prev, exerciseId]
                  );
                }}
              />
              {exercise.name}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleAssignExercises}>Attribuer Exercices</button>
    </div>
  );
};

export default AssignExercises;
