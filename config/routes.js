var Index = require('../app/controllers/index');
var Track = require('../app/controllers/track');
var News = require('../app/controllers/news');
var User = require('../app/controllers/user');
var Site = require('../app/controllers/site');
var Bill = require('../app/controllers/bill');
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
  // app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist);
  app.get('/admin/user/list', User.userlist);

  app.post('/admin/news/save', News.save);
  app.get('/admin/news/new', News.new);
  app.get('/admin/news/update/:id', News.update);
  app.get('/news/:id', News.detail);
  app.get('/admin/news/list', News.list);
  app.delete('/admin/news/list', News.del);

  app.post('/admin/ad/save', Ad.save);
  app.get('/admin/ad/new', Ad.new);
  app.get('/admin/ad/update/:id', Ad.update);
  app.get('/ad/:id', Ad.detail);
  app.get('/admin/ad/list', Ad.list);
  app.delete('/admin/ad/list', Ad.del);

  app.post('/admin/site/save', Site.save);
  app.get('/admin/site/new', Site.new);
  app.get('/admin/site/update/:id', Site.update);
  app.get('/site', Site.site);
  app.get('/site/:id', Site.detail);
  app.get('/admin/site/list', Site.list);
  app.delete('/admin/site/list', Site.del);

  app.post('/admin/bill/save', Bill.save);
  app.get('/admin/bill/new', Bill.new);
  app.get('/admin/bill/update/:id', Bill.update);
  app.get('/bill/:id', Bill.detail);
  app.get('/admin/bill/list', Bill.list);

  app.get('/admin/track/:id', Track.query);

  app.get('/api/check/email', Api.checkEmail);
  app.get('/api/query/sitemap', Api.querySiteDetail);
  app.get('/api/query/bills', Api.queryBills);
  app.get('/api/query/track', Api.queryTrack);
  app.post('/api/save/track', Api.saveTrack);
  app.post('/api/check/user', Api.checkUser);
  app.post('/api/query/site', Api.querySite);
};