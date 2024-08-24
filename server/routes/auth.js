// server/routes/auth.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.status(200).send('Connexion réussie');
  } else {
    res.status(401).send('Email ou mot de passe incorrect');
  }
});

router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  // Logique pour créer un nouvel utilisateur
  // Par exemple, enregistrement dans la base de données
  res.status(201).send('Compte créé avec succès!');
});

module.exports = router;
