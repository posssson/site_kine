// client/src/components/Exercises.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Generalcss.css'; // Assurez-vous d'avoir un fichier CSS pour le style
import './Exercises.css'; // Assurez-vous d'avoir un fichier CSS pour le style

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [pathologies, setPathologies] = useState([]);
    const [newExercise, setNewExercise] = useState({ name: '', description: '', pathologyIds: [] });
    const [editingExerciseId, setEditingExerciseId] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pathologiesResponse = await axios.get(`${apiUrl}/api/pathologies`);
                setPathologies(pathologiesResponse.data);

                const exercisesResponse = await axios.get(`${apiUrl}/api/exercises`);
                setExercises(exercisesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données', error);
            }
        };

        fetchData();
    }, [apiUrl]);

    const handleAddOrUpdateExercise = async () => {
        if (!newExercise.name) {
            alert('Le nom de l\'exercice est obligatoire.');
            return;
        }

        try {
            if (editingExerciseId) {
                const response = await axios.put(`${apiUrl}/api/exercises/${editingExerciseId}`, newExercise);
                setExercises(exercises.map(ex => ex._id === editingExerciseId ? response.data : ex));
                setEditingExerciseId(null);
            } else {
                const response = await axios.post(`${apiUrl}/api/exercises`, newExercise);
                setExercises([...exercises, response.data]);
            }
            setNewExercise({ name: '', description: '', pathologyIds: [] });
        } catch (error) {
            console.error('Erreur lors de l\'ajout ou de la mise à jour de l\'exercice', error);
        }
    };

    const handleDeleteExercise = async (exerciseId) => {
        try {
            await axios.delete(`${apiUrl}/api/exercises/${exerciseId}`);
            setExercises(exercises.filter(ex => ex._id !== exerciseId));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'exercice', error);
        }
    };

    const handleEditExercise = (exercise) => {
        setNewExercise({
            name: exercise.name,
            description: exercise.description,
            pathologyIds: exercise.pathologies.map(p => p._id)
        });
        setEditingExerciseId(exercise._id);
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
        <div className="container">
            <h2>{editingExerciseId ? 'Modifier l\'Exercice' : 'Ajouter un Exercice'}</h2>
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
                    <div key={pathology._id} className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={newExercise.pathologyIds.includes(pathology._id)}
                            onChange={() => handlePathologyChange(pathology._id)}
                        />
                        {pathology.name}
                    </div>
                ))}
            </div>
            <button onClick={handleAddOrUpdateExercise}>
                {editingExerciseId ? 'Mettre à jour l\'exercice' : 'Ajouter l\'exercice'}
            </button>
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
                        <button onClick={() => handleEditExercise(exercise)}>Modifier</button>
                        <button className="delete-button" onClick={() => handleDeleteExercise(exercise._id)}>Supprimer</button>
                    </li>
                ))}
            </ul>


        </div>
    );
};

export default Exercises;
