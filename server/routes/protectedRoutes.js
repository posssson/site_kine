// server/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.send('Bienvenue sur votre tableau de bord!');
});

module.exports = router;