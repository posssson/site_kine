// server/routes/auth.js
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur du serveur' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la connexion' });
      }
      return res.status(200).json({ message: 'Connexion réussie!', token: 'votre_token' });
    });
  })(req, res, next);
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send('Compte créé avec succès!');
  } catch (error) {
    res.status(400).send('Erreur lors de la création du compte');
  }
});

module.exports = router;
