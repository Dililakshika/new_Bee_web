const mongoose = require('mongoose');

const HiveSchema = new mongoose.Schema({
    location: { type: String, required: true },
    serialNumber: { type: String, required: true },
    date: { type: Date, default: Date.now },
    beesIn: Number,
    beesOut: Number,
    honeyLevel: Number,
    temperature: Number,
    humidity: Number,
    harvestReady: Boolean
});

module.exports = mongoose.model('Hive', HiveSchema);
