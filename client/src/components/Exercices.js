// client/src/components/Exercises.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [pathologies, setPathologies] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: '', description: '', pathologyIds: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pathologiesResponse = await axios.get('http://localhost:5000/api/pathologies');
        setPathologies(pathologiesResponse.data);

        const exercisesResponse = await axios.get('http://localhost:5000/api/exercises');
        setExercises(exercisesResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    fetchData();
  }, []);

  const handleAddExercise = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/exercises', newExercise);
      setExercises([...exercises, response.data]);
      setNewExercise({ name: '', description: '', pathologyIds: [] });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'exercice', error);
    }
  };

  const handlePathologyChange = (pathologyId) => {
    setNewExercise((prev) => ({
      ...prev,
      pathologyIds: prev.pathologyIds.includes(pathologyId)
        ? prev.pathologyIds.filter(id => id !== pathologyId)
        : [...prev.pathologyIds, pathologyId]
    }));
  };

  return (
    <div>
      <h2>Ajouter un Exercice</h2>
      <input
        type="text"
        value={newExercise.name}
        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
        placeholder="Nom de l'exercice"
      />
      <input
        type="text"
        value={newExercise.description}
        onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
        placeholder="Description de l'exercice"
      />
      <div>
        <h3>Associer des Pathologies</h3>
        {pathologies.map((pathology) => (
          <div key={pathology._id}>
            <input
              type="checkbox"
              checked={newExercise.pathologyIds.includes(pathology._id)}
              onChange={() => handlePathologyChange(pathology._id)}
            />
            {pathology.name}
          </div>
        ))}
      </div>
      <button onClick={handleAddExercise}>Ajouter l'exercice</button>
      <h3>Liste des Exercices</h3>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise._id}>
            <strong>{exercise.name}</strong>: {exercise.description}
            <ul>
              {exercise.pathologies.map((pathology) => (
                <li key={pathology._id}>{pathology.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exercises;
