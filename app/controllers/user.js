var User = require('../models/user');
//signup 注册 signin 登录

exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  });
};

exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面'
  });
};

exports.signup = function(req, res) {
  var _user = req.body.user;

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
};

exports.signin = function(req, res) {
  var _user = req.body.user;
  var email = _user.email;
  var password = _user.password;

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
        return res.redirect('/');
      } else {
        return res.redirect('/signup');
      }
    });
  });
};

exports.logout = function(req, res) {
  delete req.session.user;
  res.redirect('/');
};

exports.userlist = function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err);
    }
    res.render('backend/userlist', {
      title: '用户列表页',
      users: users
    });
  });
};

exports.signinRequired = function(req, res, next) {
  var user = req.session.user;

  if (!user) {
    return res.redirect('/signin');
  }

  next();
};

exports.adminRequired = function(req, res) {
  var user = req.session.user;

  if (user.role <= 10) {
    return res.redirect('/signin');
  }

  next();
};

