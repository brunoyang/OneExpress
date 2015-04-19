var Index = require('../app/controllers/index');
var News = require('../app/controllers/news');
var User = require('../app/controllers/user');
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
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist);

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

  app.get('/api/check/email', Api.checkEmail);
  app.post('/api/check/user', Api.checkUser);
};