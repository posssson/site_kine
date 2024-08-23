// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String, // Vous devriez hacher les mots de passe dans une vraie application
});

module.exports = mongoose.model('User', UserSchema);
