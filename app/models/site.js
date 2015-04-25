var mongoose = require('mongoose');
var SiteSchema = require('../schemas/site');
var Site = mongoose.model('Site', SiteSchema);

module.exports = Site;