exports.to404 = function(req, res, next) {
  next();
};

exports.to403 = function(req, res, next) {
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
};

exports.to500 = function(req, res, next) {
  next(new Error('keyboard cat!'));
};