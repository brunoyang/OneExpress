var mongoose = require('mongoose');
var BillSchema = require('../schemas/bill');
var Bill = mongoose.model('Bill', BillSchema);

module.exports = Bill;