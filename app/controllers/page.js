var Page = require('../models/page');
var _ = require('underscore');

exports.detail = function(req, res, next) {
  var first = req.params.first;
  var second = req.params.second;
  var tag = first + '/' + second;

  Page.findByTag(tag, function(err, page) {
    if (err) {
      next(err);
      return;
    }
    
    if (page === null) {
      next();
      return;
    }

    res.render('frontend/' + first + '/' + first, {
      title: page.title + ' - 一通快递',
      page: page,
      first: first
    });
  });
};

exports.new = function(req, res, next) {
  res.render('backend/page/page', {
    title: '后台单页编辑',
    page: {
      title: '',
      tag: '',
      content: ''
    }
  });
};

exports.save = function(req, res, next) {
  var pageObj = req.body.page;
  var id = pageObj.id;
  var tag = pageObj.tag;
  var _page = null;

  if (id !== 'undefined') {
    Page.findById(id, function(err, page) {
      _page = _.extend(page, pageObj);
      _page.save(function(err, page) {
        if (err) {
          console.log(err);
        }

        res.redirect('/admin/page/list');
      });
    });
  } else {
    _page = new Page({
      tag: pageObj.tag,
      title: pageObj.title,
      content: pageObj.content
    });
    _page.save(function(err, page) {
      if (err) {
        next(err);
        return;
      }

      res.redirect('/admin/page/list');
    });
  }
};

exports.update = function(req, res, next) {
  var first = req.params.first;
  var second = req.params.second;
  var tag = first + '/' + second;

  if (tag) {
    Page.findByTag(tag, function(err, page) {
      if (err) {
        next(err);
        return;
      }

      res.render('backend/page/page', {
        title: '单页更新',
        page: page
      });
    });
  }
};

exports.list = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Page.fetch(function(err, pages) {
    if (err) {
      console.log(err);
    }

    var len = pages.length;

    if(len > limit) {
      pages.length = limit;
    }

    res.render('backend/page/pagelist', {
      title: '单页列表',
      pages: pages,
      sum: len,
      limit: limit
    });
  });
};

exports.del = function(req, res, next) {
  var id = req.query.id;

  if (id) {
    Page.remove({
      _id: id
    }, function(err, page) {
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