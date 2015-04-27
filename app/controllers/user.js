var User = require('../models/user');
var _ = require('underscore');
//signup 注册 signin 登录

exports.showSignup = function(req, res) {
  res.render('frontend/user/signup', {
    title: '注册页面'
  });
};

exports.showSignin = function(req, res) {
  res.render('frontend/user/signin', {
    title: '登录页面'
  });
};

exports.signup = function(req, res) {
  var _user = req.body.user;
  var isFirstOne = false;

  User.fetch(function(err, user) {
    if(user == false) {
      isFirstOne = true;
    }

    if(isFirstOne) {
      _user.role = 51;
      user = new User(_user);
      user.save(function(err, user) {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
      });
    } else {
      User.findByEmail( _user.email, function(err, user) {
        if (err) {
          console.log(err);
        }
       
        if (user) {
          return res.redirect('/signin');
        } else {
          user = new User(_user);
          user.save(function(err, user) {
            if (err) {
              console.log(err);
            }
            res.redirect('/');
          });
        }
      });
    }
  });
};

exports.signin = function(req, res) {
  var _user = req.body.user;
  var email = _user.email;
  var password = _user.password;
  var url = req.query.url;

  User.findByEmail(email, function(err, user) {
    if (err) {
      console.log(err);
    }
    
    if (!user) {
      return res.redirect('/signup');
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err);
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

exports.logout = function(req, res) {
  var url = req.query.url;
  delete req.session.user;
  res.redirect(url || '/');
};

exports.new = function(req, res) {
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

exports.save = function(req, res) {
  var id = req.body.user.id;
  var userObj = req.body.user;
  var _user = null;

  if (id !== 'undefined') {
    User.findById(id, function(err, user) {
      if (err) {
        console.log(err);
      }

      _user = _.extend(user, userObj);
      _user.save(function(err, user) {
        if (err) {
          console.log(err);
        }

        res.redirect('/admin/user/list');
      });
    });
  } else {
    User.findByEmail(userObj.email, function(err, user) {
      if (err) {
        console.log(err);
      }
     
      if (user) {
        return res.redirect('/signin');
      } else {
        user = new User(userObj);
        user.save(function(err, user) {
          if (err) {
            console.log(err);
          }
          res.redirect('/admin/user/list');
        });
      }
    });
  }
};

exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    User.findById(id, function(err, user) {
      if (err) {
        console.log(err);
      }

      res.render('backend/user/user', {
        title: '用户更新',
        user: user
      });
    });
  }
};

exports.list = function(req, res) {
  console.log(11);
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  User.fetchLimit(start, limit, function(err, users){
    if(err) {
      console.log(err);
    }
    res.render('backend/user/userlist', {
      title: '用户列表',
      users: users,
      role: req.session.user.role
    });
  });
};

exports.del = function(req, res) {
  var id = req.query.id;

  if (id) {
    User.remove({
      _id: id
    }, function(err, user) {
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

