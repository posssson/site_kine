// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

app.use(express.json());
const corsOptions = {
  origin: 'http://192.168.0.18:4500', // Replace with your client's origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

// Configuration de la session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Assurez-vous que 'secure' est false si vous n'utilisez pas HTTPS
}));

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

// Monte les routes d'authentification sans préfixe, donc /login est accessible
app.use(authRoutes);

// Monte les routes protégées avec le préfixe /api
app.use('/api', protectedRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
