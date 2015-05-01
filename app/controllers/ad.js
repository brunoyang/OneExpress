var mongoose = require('mongoose');
var Ad = mongoose.model('Ad');
var _ = require('underscore');
var nodejieba = require('../segment/nodejieba');

exports.ad = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Ad.fetchLimit(start, limit, function(err, ads) {
    if (err) {
      next(err);
      return;
    }
    res.render('frontend/ad/ad', {
      title: '广告列表',
      ads: ads
    });
  });
};

exports.detail = function(req, res, next) {
  var id = req.params.id;

  Ad.findById(id, function(err, ad) {
    if (err) {
      next(err);
      return;
    }

    res.render('frontend/ad/ad_detail', {
      title: ad.title + ' - 一通快递',
      ad: ad
    });
  });
};

exports.new = function(req, res, next) {
  res.render('backend/ad/ad', {
    title: '后台广告编辑',
    ad: {
      imgSrc: '',
      title: '',
      content: ''
    }
  });
};

exports.save = function(req, res, next) {
  var id = req.body.ad.id;
  var adObj = req.body.ad;
  var _ad = null;

  if (id !== 'undefined') {
    Ad.findById(id, function(err, ad) {
      if (err) {
        next(err);
        return;
      }

      adObj['index'] = nodejieba.queryCutSync(ad.title);
      _ad = _.extend(ad, adObj);
      _ad.save(function(err, ad) {
        if (err) {
          console.log(err);
        }

        res.redirect('/admin/ad/list');
      });
    });
  } else {
    _ad = new Ad({
      imgSrc: adObj.imgSrc,
      title: adObj.title,
      content: adObj.content,
      index: nodejieba.queryCutSync(adObj.title)
    });
    _ad.save(function(err, ad) {
      if (err) {
        next(err);
        return;
      }

      res.redirect('/admin/ad/list');
    });
  }
};

exports.update = function(req, res, next) {
  var id = req.params.id;

  if (id) {
    Ad.findById(id, function(err, ad) {
      if (err) {
        next(err);
        return;
      }

      res.render('backend/ad/ad', {
        title: '广告更新',
        ad: ad
      });
    });
  }
};

exports.list = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Ad.fetch(function(err, ads) {
    if (err) {
      next(err);
      return;
    }

    var len = ads.length;
    if(len > limit) {
      ads.length = limit;
    }

    res.render('backend/ad/adlist', {
      title: '广告列表',
      ads: ads,
      sum: len,
      limit: limit
    });
  });
};

exports.del = function(req, res, next) {
  var id = req.query.id;

  if (id) {
    Ad.remove({
      _id: id
    }, function(err, ad) {
      if (err) {
        next(err);
        return;
      } else {
        res.json({
          success: 1
        });
      }
    });
  }
};