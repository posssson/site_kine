// server/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const Pathology = require('../models/Pathologie');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment'); // Assurez-vous d'avoir un modèle Appointment
const Exercise = require('../models/Exercise');

// Route pour attribuer des exercices à un rendez-vous
router.post('/assign-exercises', isAuthenticated, async (req, res) => {
  const { appointmentId, exercises } = req.body;

  try {
    // Vérifiez si le rendez-vous existe
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' });
    }

    // Vérifiez si les exercices existent
    const validExercises = await Exercise.find({ _id: { $in: exercises } });
    if (validExercises.length !== exercises.length) {
      return res.status(400).json({ error: 'Un ou plusieurs exercices sont invalides' });
    }

    // Attribuer les exercices au rendez-vous
    appointment.exercises = exercises;
    await appointment.save();

    res.status(200).json({ message: 'Exercices attribués avec succès', appointment });
  } catch (error) {
    console.error('Erreur lors de l\'attribution des exercices:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route pour ajouter un exercice
router.post('/exercises', isAuthenticated, async (req, res) => {
  try {
    const { name, description, pathologyIds } = req.body;
    const exercise = new Exercise({ name, description, pathologies: pathologyIds });
    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de l\'ajout de l\'exercice' });
  }
});

// Route pour obtenir les exercices
router.get('/exercises', isAuthenticated, async (req, res) => {
  try {
    const exercises = await Exercise.find().populate('pathologies');
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des exercices' });
  }
});

// Route pour mettre à jour un exercice
router.put('/exercises/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, description, pathologyIds } = req.body;
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { name, description, pathologies: pathologyIds },
      { new: true, runValidators: true }
    );
    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }
    res.status(200).json(exercise);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'exercice' });
  }
});

// Route pour supprimer un exercice
router.delete('/exercises/:id', isAuthenticated, async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }
    res.status(200).json({ message: 'Exercice supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'exercice' });
  }
});

// Route pour récupérer les rendez-vous
router.get('/appointments', isAuthenticated, async (req, res) => {
  try {
    // Utilisez populate pour inclure les informations du patient
    const appointments = await Appointment.find({ userId: req.user.id }).populate('patientId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
  }
});

// Route pour créer un rendez-vous
router.post('/appointments', isAuthenticated, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      userId: req.user.id, // Associer le rendez-vous à l'utilisateur connecté
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du rendez-vous' });
  }
});

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.send('Bienvenue sur votre tableau de bord!');
  });

// Route pour le calendrier
router.get('/calendar', isAuthenticated, async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const appointments = await Appointment.find({
      userId: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des données du calendrier' });
  }
});

// Route pour créer une nouvelle pathologie
router.post('/pathologies', isAuthenticated, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newPathology = new Pathology({ name, description });
    await newPathology.save();
    res.status(201).json(newPathology);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour obtenir toutes les pathologies
router.get('/pathologies', isAuthenticated, async (req, res) => {
  try {
    const pathologies = await Pathology.find();
    res.json(pathologies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour récupérer les patients
// Exemple de route pour récupérer les patients avec les détails de la pathologie
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().populate('pathology');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des patients' });
  }
});

// Route pour ajouter un nouveau patient
router.post('/patients', isAuthenticated, async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du patient:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});



// Créer un rendez-vous
router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Récupérer tous les rendez-vous
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patientId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
