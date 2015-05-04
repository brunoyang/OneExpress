var mongoose = require('mongoose');
var ComplaintSchema = require('../schemas/complaint');
var Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;