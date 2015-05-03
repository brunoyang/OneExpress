var mongoose = require('mongoose');
var Contraband = mongoose.model('Contraband');
var _ = require('underscore');
var nodejieba = require('../segment/nodejieba');

exports.detail = function(req, res, next) {
  res.render('frontend/tools/contraband', {
    title:  '禁寄品查询 - 一通快递',
    toolsTitle: '禁寄品查询',
    first: 'tools'
  });
};

exports.new = function(req, res, next) {
  res.render('backend/contraband/contraband', {
    title: '新增禁寄品',
    contraband: {
      name: ''
    }
  });
};

exports.save = function(req, res, next) {
  var id = req.body.contraband.id;
  var contrabandObj = req.body.contraband;
  var _contraband = null;

  if (id !== 'undefined') {
    Contraband.findById(id, function(err, contraband) {
      if (err) {
        next(err);
        return;
      }

      _contraband.save(function(err, contraband) {
        if (err) {
          next(err);
          return;
        }

        res.redirect('/admin/contraband/list');
      });
    });
  } else {
    _contraband = new Contraband({
      name: contrabandObj.name,
    });
    _contraband.save(function(err, contraband) {
      if (err) {
        next(err);
        return;
      }

      res.redirect('/admin/contraband/list');
    });
  }
};

exports.update = function(req, res, next) {
  var id = req.params.id;

  if (id) {
    Contraband.findById(id, function(err, contraband) {
      if (err) {
        next(err);
        return;
      }

      res.render('backend/contraband/contraband', {
        title: '禁寄品更新',
        contraband: contraband
      });
    });
  }
};

exports.list = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Contraband.fetch(function(err, contrabands) {
    if (err) {
      next(err);
      return;
    }

    var len = contrabands.length;

    if (len > limit) {
      contrabands.length = limit;
    }

    res.render('backend/contraband/contrabandlist', {
      title: '禁寄品列表',
      contrabands: contrabands,
      sum: len,
      limit: limit
    });
  });
};

exports.del = function(req, res, next) {
  var id = req.query.id;

  if (id) {
    Contraband.remove({
      _id: id
    }, function(err, contraband) {
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