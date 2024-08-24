// server/routes/auth.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Identifiants incorrects');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Identifiants incorrects');
    }
    res.status(200).send('Connexion réussie!');
  } catch (error) {
    res.status(500).send('Erreur lors de la connexion');
  }
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).send('Compte créé avec succès!');
  } catch (error) {
    res.status(400).send('Erreur lors de la création du compte');
  }
});

module.exports = router;
