const mongoose = require('mongoose');

const hiveSchema = new mongoose.Schema({
  hiveNo: { type: String, required: true },  // Hive number
  date: { type: Date, required: true },      // Date
  temperature: { type: Number, required: true }, // Temperature
  humidity: { type: Number, required: true },    // Humidity
  weight: { type: Number, required: true },      // Weight of the hive
  beesIn: { type: Number, required: true },      // Number of bees entering
  beesOut: { type: Number, required: true },     // Number of bees exiting
  status: { type: String, enum: ['Healthy', 'Unhealthy'], required: true },  // Hive health status
  harvestReady: { type: Boolean, default: false },  // If harvest conditions are met
  location: { type: String, required: true }  // New field: Location name (e.g., 'Batticaloa')
});

const Hive = mongoose.model('Hive', hiveSchema);
module.exports = Hive;
