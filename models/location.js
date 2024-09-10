const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  hiveNo: { type: String, required: true, unique: true }, // Hive number
  location: { type: String, required: true }  // Location name (e.g., Akkaraipattu, Batticaloa)
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
