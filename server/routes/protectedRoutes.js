// server/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const Appointment = require('../models/Appointment'); // Assurez-vous d'avoir un modèle Appointment

// Route pour récupérer les rendez-vous
router.get('/appointments', isAuthenticated, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }); // Filtrer par utilisateur si nécessaire
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

// Autres routes pour mettre à jour et supprimer des rendez-vous peuvent être ajoutées ici

module.exports = router;
