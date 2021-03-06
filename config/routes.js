var Index = require('../app/controllers/index');
var Track = require('../app/controllers/track');
var News = require('../app/controllers/news');
var User = require('../app/controllers/user');
var Site = require('../app/controllers/site');
var Bill = require('../app/controllers/bill');
var Page = require('../app/controllers/page');
var Api = require('../app/controllers/api');
var Ad = require('../app/controllers/ad');
var Hr = require('../app/controllers/hr');
var Error = require('../app/controllers/error');
var Contraband = require('../app/controllers/contraband');
var Complaint = require('../app/controllers/complaint');
var Freight = require('../app/controllers/freight');
var Service = require('../app/controllers/service');

module.exports = function(app) {
  app.use(function(req, res, next) {
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  });

  //index
  app.get('/', Index.FEIndex);
  app.get('/admin', User.signinRequired, User.adminRequired, Index.BEIndex);

  //user
  app.post('/user/signup', User.signup);
  app.post('/user/signin', User.signin);
  app.get('/signin', User.showSignin);
  app.get('/signup', User.showSignup);
  app.get('/logout', User.logout);
  app.get('/admin/user/update/:id', User.signinRequired, User.adminRequired, User.superAdminRequired, User.update);
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
  app.get('/admin/user/new', User.signinRequired, User.adminRequired, User.new);
  app.post('/admin/user/save', User.signinRequired, User.adminRequired, User.save);
  app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.del);


  //news
  app.get('/news', News.news);
  app.get('/news/detail/:id', News.detail);
  app.post('/admin/news/save', User.signinRequired, User.adminRequired, News.save);
  app.get('/admin/news/new', User.signinRequired, User.adminRequired, News.new);
  app.get('/admin/news/update/:id', User.signinRequired, User.adminRequired, News.update);
  app.get('/admin/news/list', User.signinRequired, User.adminRequired, News.list);
  app.delete('/admin/news/list', User.signinRequired, User.adminRequired, News.del);

  //ad
  app.get('/ad', Ad.ad);
  app.get('/ad/detail/:id', Ad.detail);
  app.post('/admin/ad/save', User.signinRequired, User.adminRequired, Ad.saveImg, Ad.save);
  app.get('/admin/ad/new', User.signinRequired, User.adminRequired, Ad.new);
  app.get('/admin/ad/update/:id', User.signinRequired, User.adminRequired, Ad.update);
  app.get('/admin/ad/list', User.signinRequired, User.adminRequired, Ad.list);
  app.delete('/admin/ad/list', User.signinRequired, User.adminRequired, Ad.del);

  //site
  app.get('/site', Site.site);
  app.get('/site/detail/:id', Site.detail);
  app.post('/admin/site/save', User.signinRequired, User.adminRequired, Site.save);
  app.get('/admin/site/new', User.signinRequired, User.adminRequired, Site.new);
  app.get('/admin/site/update/:id', User.signinRequired, User.adminRequired, Site.update);
  app.get('/admin/site/list', User.signinRequired, User.adminRequired, Site.list);
  app.delete('/admin/site/list', User.signinRequired, User.adminRequired, Site.del);

  //bill
  app.get('/tools/bill', Bill.detail);
  app.get('/tools/onlinesend', Bill.onlinesend);
  app.get('/bill/detail/:id', Bill.bill);
  app.post('/admin/bill/save', User.signinRequired, User.adminRequired, Bill.save);
  app.get('/admin/bill/new', User.signinRequired, User.adminRequired, Bill.new);
  app.get('/admin/bill/update/:id', User.signinRequired, User.adminRequired, Bill.update);
  app.get('/admin/bill/list', User.signinRequired, User.adminRequired, Bill.list);

  //page
  app.get('/page/:first/:second', Page.detail);
  app.post('/admin/page/save', User.signinRequired, User.adminRequired, Page.save);
  app.get('/admin/page/new', User.signinRequired, User.adminRequired, Page.new);
  app.get('/admin/page/update/:first/:second', User.signinRequired, User.adminRequired, Page.update);
  app.get('/admin/page/list', User.signinRequired, User.adminRequired, Page.list);
  app.delete('/admin/page/list', User.signinRequired, User.adminRequired, Page.del);

  app.get('/admin/track/:id', User.signinRequired, User.adminRequired, Track.query);

  //hr
  app.get('/hr', Hr.hr);
  app.get('/hr/detail/:id', Hr.detail);
  app.post('/admin/hr/save', User.signinRequired, User.adminRequired, Hr.save);
  app.get('/admin/hr/new', User.signinRequired, User.adminRequired, Hr.new);
  app.get('/admin/hr/update/:id', User.signinRequired, User.adminRequired, Hr.update);
  app.get('/admin/hr/list', User.signinRequired, User.adminRequired, Hr.list);
  app.delete('/admin/hr/list', User.signinRequired, User.adminRequired, Hr.del);

  //tools-contraband
  app.get('/tools/contraband', Contraband.detail);
  app.post('/admin/contraband/save', User.signinRequired, User.adminRequired, Contraband.save);
  app.get('/admin/contraband/new', User.signinRequired, User.adminRequired, Contraband.new);
  app.get('/admin/contraband/update/:id', User.signinRequired, User.adminRequired, Contraband.update);
  app.get('/admin/contraband/list', User.signinRequired, User.adminRequired, Contraband.list);
  app.delete('/admin/contraband/list', User.signinRequired, User.adminRequired, Contraband.del);

  //tools-complaint
  app.get('/tools/complaint', Complaint.detail);
  app.post('/admin/complaint/save', User.signinRequired, User.adminRequired, Complaint.save);
  app.get('/admin/complaint/new', User.signinRequired, User.adminRequired, Complaint.new);
  app.get('/admin/complaint/reply/:id', User.signinRequired, User.adminRequired, Complaint.reply);
  app.get('/admin/complaint/list', User.signinRequired, User.adminRequired, Complaint.list);
  app.delete('/admin/complaint/list', User.signinRequired, User.adminRequired, Complaint.del);

  //tools-freight
  app.get('/tools/freight', Freight.detail);

  //service
  app.get('/service', User.signinRequired, Service.service);
  app.get('/admin/service/service', Service.admin);

  //api
  app.get('/api/check/email', Api.checkEmail);
  app.get('/api/query/sitemap', Api.querySiteDetail);
  app.get('/api/query/bills', Api.queryBills);
  app.get('/api/query/track', Api.queryTrack);
  app.get('/api/query/contraband', Api.queryContraband);
  app.get('/api/query/search', User.signinRequired, User.adminRequired, Api.search);
  app.get('/api/get/list', User.signinRequired, User.adminRequired, Api.getList);
  app.post('/api/save/track', Api.saveTrack);
  app.post('/api/save/complaint', Api.saveComplaint);
  app.post('/api/save/bill', Api.saveBill);
  app.post('/api/check/user', Api.checkUser);
  app.post('/api/query/site', Api.querySite);

  //error
  app.get('/404', Error.to404);
  app.get('/403', Error.to403);
  app.get('/500', Error.to500);
};