var mongoose = require('mongoose');
var HrSchema = require('../schemas/hr');
var Hr = mongoose.model('Hr', HrSchema);

module.exports = Hr;