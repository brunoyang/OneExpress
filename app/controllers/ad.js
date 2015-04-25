var mongoose = require('mongoose');
var Ad = mongoose.model('Ad');
var _ = require('underscore');

exports.detail = function(req, res) {
  var id = req.params.id;

  Ad.findById(id, function(err, ad) {
    res.render('frontend/ad_detail', {
      title: ad.title + ' - 一通快递',
      ad: ad
    });
  });
};

exports.new = function(req, res) {
  res.render('backend/ad', {
    title: '后台广告编辑',
    ad: {
      imgSrc: '',
      title: '',
      content: ''
    }
  });
};

exports.save = function(req, res) {
  var id = req.body.ad.id;
  var adObj = req.body.ad;
  var _ad = null;

  if (id !== 'undefined') {
    Ad.findById(id, function(err, ad) {
      if (err) {
        console.log(err);
      }

      _ad = _.extend(ad, adObj);
      _ad.save(function(err, ad) {
        if (err) {
          console.log(err);
        }

        res.redirect('/ad/' + ad._id);
      });
    });
  } else {
    _ad = new Ad({
      imgSrc: adObj.imgSrc,
      title: adObj.title,
      content: adObj.content
    });
    _ad.save(function(err, ad) {
      if (err) {
        console.log(err);
      }

      res.redirect('/ad/' + ad._id);
    });
  }
};

exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    Ad.findById(id, function(err, ad) {
      if (err) {
        console.log(err);
      }

      res.render('backend/ad', {
        title: '广告更新',
        ad: ad
      });
    });
  }
};

exports.list = function(req, res) {
  Ad.fetchLimit(0, 15, function(err, ads){
    if(err) {
      console.log(err);
    }
    res.render('backend/adlist', {
      title: '广告列表',
      ads: ads
    });
  });
};

exports.del = function(req, res) {
  var id = req.query.id;

  if (id) {
    Ad.remove({
      _id: id
    }, function(err, ad) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success: 1
        });
      }
    });
  }
};