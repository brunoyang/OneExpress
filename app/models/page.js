var mongoose = require('mongoose');
var PageSchema = require('../schemas/page');
var Page = mongoose.model('Page', PageSchema);

module.exports = Page;