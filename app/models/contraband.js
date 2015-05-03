var mongoose = require('mongoose');
var ContrabandSchema = require('../schemas/contraband');
var Contraband = mongoose.model('Contraband', ContrabandSchema);

module.exports = Contraband;