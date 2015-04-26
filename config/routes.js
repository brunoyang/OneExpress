var Index = require('../app/controllers/index');
var Track = require('../app/controllers/track');
var News = require('../app/controllers/news');
var User = require('../app/controllers/user');
var Site = require('../app/controllers/site');
var Bill = require('../app/controllers/bill');
var Page = require('../app/controllers/page');
var Api = require('../app/controllers/api');
var Ad = require('../app/controllers/ad');

module.exports = function(app) {
  app.use(function(req, res, next){
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  });

  app.get('/', Index.index);

  app.post('/user/signup', User.signup);
  app.post('/user/signin', User.signin);
  app.get('/signin', User.showSignin);
  app.get('/signup', User.showSignup);
  app.get('/logout', User.logout);
  app.get('/admin/user/update/:id', User.signinRequired, User.adminRequired, User.update);
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
  app.get('/admin/user/new', User.signinRequired, User.adminRequired, User.new);
  app.post('/admin/user/save', User.signinRequired, User.adminRequired, User.save);
  app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.del);

  app.get('/news', News.news);
  app.get('/news/detail/:id', News.detail);
  app.post('/admin/news/save', User.signinRequired, User.adminRequired, News.save);
  app.get('/admin/news/new', User.signinRequired, User.adminRequired, News.new);
  app.get('/admin/news/update/:id', User.signinRequired, User.adminRequired, News.update);
  app.get('/admin/news/list', User.signinRequired, User.adminRequired, News.list);
  app.delete('/admin/news/list', User.signinRequired, User.adminRequired, News.del);

  app.get('/ad/:id', Ad.detail);
  app.post('/admin/ad/save', User.signinRequired, User.adminRequired, Ad.save);
  app.get('/admin/ad/new', User.signinRequired, User.adminRequired, Ad.new);
  app.get('/admin/ad/update/:id', User.signinRequired, User.adminRequired, Ad.update);
  app.get('/admin/ad/list', User.signinRequired, User.adminRequired, Ad.list);
  app.delete('/admin/ad/list', User.signinRequired, User.adminRequired, Ad.del);

  app.get('/site', Site.site);
  app.get('/site/:id', Site.detail);
  app.post('/admin/site/save', User.signinRequired, User.adminRequired, Site.save);
  app.get('/admin/site/new', User.signinRequired, User.adminRequired, Site.new);
  app.get('/admin/site/update/:id', User.signinRequired, User.adminRequired, Site.update);
  app.get('/admin/site/list', User.signinRequired, User.adminRequired, Site.list);
  app.delete('/admin/site/list', User.signinRequired, User.adminRequired, Site.del);

  app.get('/bill/:id', Bill.detail);
  app.post('/admin/bill/save', User.signinRequired, User.adminRequired, Bill.save);
  app.get('/admin/bill/new', User.signinRequired, User.adminRequired, Bill.new);
  app.get('/admin/bill/update/:id', User.signinRequired, User.adminRequired, Bill.update);
  app.get('/admin/bill/list', User.signinRequired, User.adminRequired, Bill.list);

  app.get('/admin/track/:id', User.signinRequired, User.adminRequired, Track.query);

  app.get('/api/check/email', Api.checkEmail);
  app.get('/api/query/sitemap', Api.querySiteDetail);
  app.get('/api/query/bills', Api.queryBills);
  app.get('/api/query/track', Api.queryTrack);
  app.post('/api/save/track', Api.saveTrack);
  app.post('/api/check/user', Api.checkUser);
  app.post('/api/query/site', Api.querySite);

  app.get('/page/:first/:second', Page.detail);
  app.post('/admin/page/save', User.signinRequired, User.adminRequired, Page.save);
  app.get('/admin/page/new', User.signinRequired, User.adminRequired, Page.new);
  app.get('/admin/page/update/:first/:second', User.signinRequired, User.adminRequired, Page.update);
  app.get('/admin/page/list', User.signinRequired, User.adminRequired, Page.list);
  app.delete('/admin/page/list', User.signinRequired, User.adminRequired, Page.del);
};