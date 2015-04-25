var mongoose = require('mongoose');
var TrackSchema = require('../schemas/track');
var Track = mongoose.model('Track', TrackSchema);

module.exports = Track;