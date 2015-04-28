var Track = require('../models/track');

exports.query = function(req, res, next) {
  var id = req.params.id;

  Track.findById(id, function(err, tracklist) {
    if (err) {
      next(err);
      return;
    }
    var track = tracklist ? tracklist.trackinfo : '';
    res.render('backend/track/track', {
      title: '快递追踪',
      id: id,
      tracklist: track
    });
  });
};