var mongoose = require('mongoose');
var AdSchema = require('../schemas/ad');
var Ad = mongoose.model('Ad', AdSchema);

module.exports = Ad;