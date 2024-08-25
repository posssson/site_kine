// server/routes/auth.js
const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

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
