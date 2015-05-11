var mongoose = require('mongoose');
var Hr = require('../models/hr');
var _ = require('underscore');
var nodejieba = require('../models/nodejieba');

exports.hr = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Hr.fetchLimit(start, limit, function(err, hrs) {
    if (err) {
      next(err);
      return;
    }
    res.render('frontend/hr/hr', {
      title: '招聘信息 - 一通快递',
      hrs: hrs
    });
  });
};

exports.detail = function(req, res, next) {
  var id = req.params.id;

  Hr.findById(id, function(err, hr) {
    res.render('frontend/hr/hr_detail', {
      title: hr.job + ' - 一通快递',
      hr: hr
    });
  });
};

exports.new = function(req, res, next) {
  res.render('backend/hr/hr', {
    title: '增加职位',
    hr: {
      job: '',
      work: [''],
      req: [''],
      area: '',
      num: 1
    }
  });
};

exports.save = function(req, res, next) {
  var hrObj = req.body.hr;
  var id = hrObj.id;
  var _hr = null;
  var _req = [];
  var work = [];

  if (id !== 'undefined') {
    Hr.findById(id, function(err, hr) {
      if (err) {
        next(err);
        return;
      }
      
      hrObj.index = hr.job;
      _hr = _.extend(hr, hrObj);
      _.each(hrObj, function(item, index) {
        if (/^work_/.test(index)) {
          work.push(item);
        }
        if(/^req_/.test(index)) {
          req.push(item);
        }
      });
      _hr.work = work;
      _hr.req = req;

      _hr.save(function(err, hr) {
        if (err) {
          next(err);
          return;
        }

        res.redirect('/admin/hr/list');
      });
    });
  } else {
    _.each(hrObj, function(item, index) {
      if (/^work_/.test(index)) {
        work.push(item);
      }
      if(/^req_/.test(index)) {
        req.push(item);
      }
    });

    _hr = new Hr({
      job: hrObj.job,
      work: work,
      req: req,
      index: hrObj.job,
      area: hrObj.area
    });

    _hr.save(function(err, hr) {
      if (err) {
        next(err);
        return;
      }

      res.redirect('/admin/hr/list');
    });
  }
};

exports.update = function(req, res, next) {
  var id = req.params.id;

  if (id) {
    Hr.findById(id, function(err, hr) {
      if (err) {
        next(err);
        return;
      }

      res.render('backend/hr/hr', {
        title: '职位更新',
        hr: hr
      });
    });
  }
};

exports.list = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Hr.fetch(function(err, hrs) {
    if (err) {
      next(err);
      return;
    }

    var len = hrs.length;

    if (len > limit) {
      hrs.length = limit;
    }

    res.render('backend/hr/hrlist', {
      title: '新闻列表',
      hrs: hrs,
      sum: len,
      limit: limit
    });
  });
};

exports.del = function(req, res, next) {
  var id = req.query.id;

  if (id) {
    Hr.remove({
      _id: id
    }, function(err, hr) {
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