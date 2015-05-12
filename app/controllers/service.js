exports.service = function(req, res, next) {
  res.render('frontend/service/service', {
    title: '客户服务'
  });
};

exports.admin = function(req, res, next) {
  res.render('backend/service/service', {
    title: '客户服务'
  });
};