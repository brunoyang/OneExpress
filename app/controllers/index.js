var News = require('../models/news');
var Ad = require('../models/ad');

exports.FEIndex = function(req, res) {
  News.fetchLimit(0, 15, function(err, newslist) {
    if (err) {
      console.log(err);
    }
    Ad.fetchLimit(0, 5, function(err, ads) {
      if(err) {
        console.log(err);
      }
      res.render('frontend/index', {
        title: '首页',
        newslist: newslist,
        ads: ads
      });
    });
  });
};

exports.BEIndex = function(req, res) {
  res.render('backend/index', {
    title: '首页'
  });
};