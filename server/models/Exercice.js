// models/Exercise.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: String,
  description: String,
  pathologies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pathology' }]
});

module.exports = mongoose.model('Exercise', exerciseSchema);