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

module.exports = router;
