// server/models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pathology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pathology', // Référence au modèle Pathology
    required: true,
  },
  // Ajoutez d'autres champs pertinents ici
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;