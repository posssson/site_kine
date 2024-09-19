// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Configuration CORS
// origin: 'http://192.168.0.18:4500', // Remplacez par l'origine de votre client
const corsOptions = {
  origin: ['http://192.168.0.18:4500','https://testkine.duckdns.org'],
  credentials: true, // Autoriser les cookies et les en-têtes d'autorisation
};
app.use(cors(corsOptions));

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/kine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Configuration de la session avec MongoDB
app.use(session({
  secret: 'your_secret_key', // Remplacez par une clé secrète sécurisée
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/kine', // Assurez-vous que l'URL est correcte
    collectionName: 'sessions'
  }),
  cookie: { secure: false } // Assurez-vous que 'secure' est false si vous n'utilisez pas HTTPS
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  next();
});

// Routes
 // Routes d'authentificatio
app.use('/auth', (req, res, next) => {
  console.log(`Auth route accessed: ${req.method} ${req.url}`);
  next();
}, authRoutes);

app.use('/api', protectedRoutes); // Routes protégées avec le préfixe /api

// Route d'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil!');
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server started`);
  console.log(`Server is running on port ${PORT}`);
});
