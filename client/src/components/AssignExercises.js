import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignExercises = () => {
  const [appointments, setAppointments] = useState([]);
  const [exercisesByPathology, setExercisesByPathology] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments with patient details
        const appointmentsResponse = await axios.get('http://192.168.0.18:5000/api/appointments');
        setAppointments(appointmentsResponse.data);

        // Fetch exercises and group them by pathology
        const exercisesResponse = await axios.get('http://192.168.0.18:5000/api/exercises');
        const exercises = exercisesResponse.data;

        const groupedExercises = exercises.reduce((acc, exercise) => {
          const pathologyName = exercise.pathologies.map(p => p.name).join(", ");
          if (!acc[pathologyName]) {
            acc[pathologyName] = [];
          }
          acc[pathologyName].push(exercise);
          return acc;
        }, {});

        setExercisesByPathology(groupedExercises);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      }
    };

    fetchData();
  }, []);

  const handleAssignExercises = async () => {
    if (!selectedAppointment) {
      alert('Veuillez sélectionner un rendez-vous.');
      return;
    }

    try {
      await axios.post('http://192.168.0.18:5000/api/assign-exercises', {
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
            <li key={appointment.id}>
              <label>
                <input
                  type="radio"
                  name="appointment"
                  value={appointment.id}
                  onChange={() => setSelectedAppointment(appointment.id)}
                />
                {new Date(appointment.date).toLocaleString()} - {appointment.patientId.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3>Sélectionnez des Exercices</h3>
        {Object.entries(exercisesByPathology).map(([pathology, exercises]) => (
          <div key={pathology}>
            <h4>{pathology}</h4>
            <ul>
              {exercises.map(exercise => (
                <li key={exercise.id}>
                  <label>
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
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <button onClick={handleAssignExercises}>Attribuer Exercices</button>
    </div>
  );
};

export default AssignExercises;
