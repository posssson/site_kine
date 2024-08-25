// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport'); // Importez votre configuration Passport
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Configuration de la session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Connexion à MongoDB
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
app.use('/api', protectedRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
