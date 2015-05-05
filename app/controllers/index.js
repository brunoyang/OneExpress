var News = require('../models/news');
var Ad = require('../models/ad');

exports.FEIndex = function(req, res, next) {
  News.fetchLimit(0, 15, function(err, newslist) {
    if(err) {
      next(err);
      return;
    }
    Ad.fetchLimit(0, 5, function(err, ads) {
      if (err) {
        next(err);
        return;
      }
      res.render('frontend/index', {
        title: '首页',
        newslist: newslist,
        ads: ads
      });
    });
  });
};

exports.BEIndex = function(req, res, next) {
  res.render('backend/index', {
    title: '首页'
  });
};