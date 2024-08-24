// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const Patient = require('./models/Patient');

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

app.use(authRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil!');
});

// Route pour récupérer les patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Route pour le tableau de bord
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
  } else {
    res.redirect('/login');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
