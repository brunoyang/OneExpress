var User = require('../models/user');
var rUsername = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
var rEmail = /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i;

function returnSuccessMsg(obj) {
  return {
    success: 1,
    data: {
      object: obj
    }
  };
}

function returnFailMsg(msg) {
  return {
    success: 0,
    data: {
      msg: msg ? msg : ''
    }
  };
}

exports.checkEmail = function(req, res) {
  var email = req.query.email;

  if (rEmail.test(email)) {
    User.findByEmail(email, function(err, user) {
      if (err) {
        console.log(err);
      }
      if (user) {
        return res.json(returnSuccessMsg(user));
      } else {
        return res.json(returnFailMsg('该邮箱尚未注册'));
      }
    });
  } else {
    return res.json(returnFailMsg('这不是正确的email格式哦'));
  }
};

exports.checkUser = function(req, res) {
  var _user = req.body.user,
      email = _user.email,
      password = _user.password;

  if(email === '') {
    return res.json(returnFailMsg('邮箱不能为空'));
  }

  if(password === '') {
    return res.json(returnFailMsg('密码不能为空'));
  }

  User.findByEmail({
    email: email
  }, function(err, user){
    if(err) {
      console.log(err);
    }
    if(!user) {
      return res.json(returnFailMsg('没有该用户'));
    }

    user.comparePassword(password, function(err, isMatch) {
      if(err) {
        console.log(err);
      }
      if(isMatch) {
        return res.json(returnSuccessMsg(user));
      } else {
        return res.json(returnFailMsg('密码不正确'));
      }
    });
  });
};





