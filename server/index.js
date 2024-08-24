// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

const cors = require('cors');
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
