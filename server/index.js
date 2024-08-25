// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes'); // Assurez-vous d'importer correctement vos routes protégées

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/kine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Utilisation des routes
app.use(authRoutes);
app.use('/api', protectedRoutes); // Assurez-vous que vos routes protégées sont correctement définies

app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
