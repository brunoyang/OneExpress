var mongoose = require('mongoose');
var Site = require('../models/site');
var Area = require('../models/area');
var _ = require('underscore');
var nodejieba = require('../models/nodejieba');

exports.detail = function(req, res, next) {
  var id = req.params.id;

  Site.findById(id, function(err, site) {
    if (err) {
      next(err);
      return;
    }
    res.render('frontend/site/site_detail', {
      title: '网点信息',
      site: site,
      location: site.province + '-' + site.city + '-' + site.county
    });
  });
};

exports.site = function(req, res, next) {
  var site = req.query;
  var area = site.area;
  var location = area.split('-');
  var lastLen = location.length - 1;
  var sites = ['province', 'city', 'county'];

  Site.findByAreas(sites[lastLen], location[lastLen], function(err, sites) {
    if (err) {
      next(err);
      return;
    }

    res.render('frontend/site/site_detail', {
      title: '网点信息',
      sites: sites,
      location: area
    });
  });
};

exports.new = function(req, res, next) {
  res.render('backend/site/site', {
    title: '后台快递网点编辑',
    site: {
      province: '',
      city: '',
      county: '',
      address: '',
      telephone: '',
      areacode: '',
      manager: '',
      X: '',
      Y: ''
    }
  });
};

exports.save = function(req, res, next) {
  var id = req.body.site.id;
  var siteObj = req.body.site;
  var _site = null;
  var _area = null;

  if (id !== 'undefined') {
    _area = {
      province: siteObj.province,
      city: siteObj.city,
      county: siteObj.county,
      index: [siteObj.province, siteObj.city, siteObj.county]
    };

    Area.findByAllArea(_area, function(err, area) {
      if (err) {
        next(err);
        return;
      }

      if (!area) {
        var _area_ = new Area(_area);
        _area_.save(function(err, area) {
          if (err) {
            next(err);
            return;
          }
        });
      }
      Site.findById(id, function(err, site) {
        if (err) {
          next(err);
          return;
        }
        siteObj['index'] = _.toArray(siteObj);
        _site = _.extend(site, siteObj);
        _site.save(function(err, site) {
          if (err) {
            next(err);
            return;
          }
          res.redirect('/admin/site/list');
        });
      });
    });
  } else {
    _area = {
      province: siteObj.province,
      city: siteObj.city,
      county: siteObj.county,
      index: [siteObj.province, siteObj.city, siteObj.county]
    };
    Area.findByAllArea(_area, function(err, area) {
      if (err) {
        next(err);
        return;
      }

      if (!area) {
        _area = new Area(_area);
        _area.save();
      }
      _site = new Site({
        province: siteObj.province,
        city: siteObj.city,
        county: siteObj.county,
        address: siteObj.address,
        telephone: siteObj.telephone,
        areacode: siteObj.areacode,
        manager: siteObj.manager,
        X: siteObj.X,
        Y: siteObj.Y,
        index: _.toArray(siteObj)
      });
      _site.save(function(err, site) {
        if (err) {
          next(err);
          return;
        }
        res.redirect('/admin/site/list');
      });
    });
  }
};

exports.update = function(req, res, next) {
  var id = req.params.id;

  if (id) {
    Site.findById(id, function(err, site) {
      if (err) {
        next(err);
        return;
      }

      res.render('backend/site/site', {
        title: '网点更新',
        site: site
      });
    });
  }
};

exports.list = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Site.fetch(function(err, sites) {
    if (err) {
      next(err);
      return;
    }

    var len = sites.length;

    if(len > limit) {
      sites.length = limit;
    }

    res.render('backend/site/sitelist', {
      title: '网点列表',
      sites: sites,
      sum: len,
      limit: limit
    });
  });
};

exports.del = function(req, res, next) {
  var id = req.query.id;

  if (id) {
    Site.remove({
      _id: id
    }, function(err, site) {
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