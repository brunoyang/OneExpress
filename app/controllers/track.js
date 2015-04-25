var Track = require('../models/track');

exports.query = function(req, res) {
  var id = req.params.id;

  Track.findById(id, function(err, tracklist){
    var track = tracklist ? tracklist.trackinfo : '';
    res.render('backend/track', {
      title: '快递追踪',
      id: id,
      tracklist: track
    });
  });
};