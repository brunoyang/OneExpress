var mongoose = require('mongoose');
var Site = require('../models/site');
var Area = require('../models/area');
var _ = require('underscore');

exports.detail = function(req, res) {
  var id = req.params.id;

  Site.findById(id, function(err, site) {
    res.render('frontend/site/site_detail', {
      title: '网点信息',
      site: site,
      location: site.province + '-' + site.city + '-' + site.county
    });
  });
};

exports.site = function(req, res) {
  var site = req.query;
  var area = site.area;
  var county = area.split('-')[2];

  Site.findByAreas(county, function(err, sites) {
    res.render('frontend/site/site_detail', {
      title: '网点信息',
      sites: sites,
      location: area
    });
  });
};

exports.new = function(req, res) {
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

exports.save = function(req, res) {
  var id = req.body.site.id;
  var siteObj = req.body.site;
  var _site = null;
  var _area = null;

  if (id !== 'undefined') {
    _area = {
      province: siteObj.province,
      city: siteObj.city,
      county: siteObj.county
    };

    Area.findByAllArea(_area, function(err, area) {
      if (err) {
        console.log(err);
      }

      if (!area) {
        var _area_ = new Area(_area);
        _area_.save(function(err, area) {
          if (err) {
            console.log(err);
          }
        });
      }
      Site.findById(id, function(err, site) {
        if (err) {
          console.log(err);
        }
        _site = _.extend(site, siteObj);
        _site.save(function(err, site) {
          if (err) {
            console.log(err);
          }
          res.redirect('/site/' + site._id);
        });
      });
    });
  } else {
    _area = {
      province: siteObj.province,
      city: siteObj.city,
      county: siteObj.county
    };
    Area.findByAllArea(_area, function(err, area) {
      if (err) {
        console.log(err);
      }
      console.log(area);
      if (!area) {
        _area = new Area(_area);
        _area.save(function(err, area) {
        });
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
        Y: siteObj.Y
      });
      _site.save(function(err, site) {
        if (err) {
          console.log(err);
        }
        res.redirect('/site/' + site._id);
      });
    });
  }
};

exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    Site.findById(id, function(err, site) {
      if (err) {
        console.log(err);
      }

      res.render('backend/site/site', {
        title: '网点更新',
        site: site
      });
    });
  }
};

exports.list = function(req, res) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Site.fetchLimit(start, limit, function(err, sites) {
    if (err) {
      console.log(err);
    }
    res.render('backend/site/sitelist', {
      title: '网点列表',
      sites: sites
    });
  });
};

exports.del = function(req, res) {
  var id = req.query.id;

  if (id) {
    Site.remove({
      _id: id
    }, function(err, site) {
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