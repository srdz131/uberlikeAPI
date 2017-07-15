/*jshint esversion:6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// subdokument schema za geometry property glavne sheme
// koristi se geoJSON format sa geoJSON.com
const PointSchema = new Schema({
  type: { type: String, default: 'Point'},
  coordinates: { type: [Number] , index: '2dsphere'}
});

const DriverSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  driving: {
    type: Boolean,
    default: false
  },
  geometry: PointSchema
});

const Driver = mongoose.model('driver', DriverSchema);

module.exports = Driver;
