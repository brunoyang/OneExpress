var User = require('../models/user');
var _ = require('underscore');
//signup 注册 signin 登录

exports.showSignup = function(req, res, next) {
  res.render('frontend/user/signup', {
    title: '注册页面'
  });
};

exports.showSignin = function(req, res, next) {
  res.render('frontend/user/signin', {
    title: '登录页面'
  });
};

exports.signup = function(req, res, next) {
  var _user = req.body.user;
  var isFirstOne = false;

  User.fetch(function(err, user) {
    if (user == false) {
      isFirstOne = true;
    }

    if (isFirstOne) {
      _user.role = 51;
      user = new User(_user);
      user.save(function(err, user) {
        if (err) {
          next(err);
          return;
        }
        res.redirect('/');
      });
    } else {
      User.findByEmail(_user.email, function(err, user) {
        if (err) {
          next(err);
          return;
        }

        if (user) {
          return res.redirect('/signin');
        } else {
          user = new User(_user);
          user.save(function(err, user) {
            if (err) {
              next(err);
              return;
            }
            res.redirect('/');
          });
        }
      });
    }
  });
};

exports.signin = function(req, res, next) {
  var _user = req.body.user;
  var email = _user.email;
  var password = _user.password;
  var url = req.query.url;

  User.findByEmail(email, function(err, user) {
    if (err) {
      next(err);
      return;
    }

    if (!user) {
      return res.redirect('/signup');
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        next(err);
        return;
      }

      if (isMatch) {
        req.session.user = user;
        return res.redirect(url);
      } else {
        return res.redirect('/signup');
      }
    });
  });
};

exports.logout = function(req, res, next) {
  var url = req.query.url;
  delete req.session.user;
  res.redirect(url || '/');
};

exports.new = function(req, res, next) {
  res.render('backend/user/user', {
    title: '后台编辑',
    role: req.session.user.role,
    user: {
      name: '',
      email: '',
      password: '',
    }
  });
};

exports.save = function(req, res, next) {
  var id = req.body.user.id;
  var userObj = req.body.user;
  var _user = null;

  if (id !== 'undefined') {
    User.findById(id, function(err, user) {
      if (err) {
        next(err);
        return;
      }

      userObj['index'] = [userObj.name, userObj.email];
      _user = _.extend(user, userObj);
      _user.save(function(err, user) {
        if (err) {
          next(err);
          return;
        }

        res.redirect('/admin/user/list');
      });
    });
  } else {
    User.findByEmail(userObj.email, function(err, user) {
      if (err) {
        next(err);
        return;
      }

      if (user) {
        return res.redirect('/signin');
      } else {
        userObj['index'] = [userObj.name, userObj.eamil];
        user = new User(userObj);
        user.save(function(err, user) {
          if (err) {
            next(err);
            return;
          }
          res.redirect('/admin/user/list');
        });
      }
    });
  }
};

exports.update = function(req, res, next) {
  var id = req.params.id;

  if (id) {
    User.findById(id, function(err, user) {
      if (err) {
        next(err);
        return;
      }

      res.render('backend/user/user', {
        title: '用户更新',
        user: user,
        role: req.session.user.role
      });
    });
  }
};

exports.list = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  User.fetch(function(err, users) {
    if (err) {
      next(err);
      return;
    }

    var len = users.length;
    if(len > limit) {
      users.length = limit;
    }

    res.render('backend/user/userlist', {
      title: '用户列表',
      users: users,
      role: req.session.user.role,
      sum: len,
      limit: limit
    });
  });
};

exports.del = function(req, res, next) {
  var id = req.query.id;

  if (id) {
    User.remove({
      _id: id
    }, function(err, user) {
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

exports.signinRequired = function(req, res, next) {
  var user = req.session.user;

  if (!user) {
    return res.redirect('/signin');
  }

  next();
};

exports.adminRequired = function(req, res, next) {
  var user = req.session.user;

  if (user.role <= 10) {
    return res.redirect('/signin');
  }

  next();
};

exports.superAdminRequired = function(req, res, next) {
  var user = req.session.user;

  if (user.role <= 50) {
    return res.redirect('/signin');
  }

  next();
};