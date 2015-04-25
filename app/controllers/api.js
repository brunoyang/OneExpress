var User = require('../models/user');
var Site = require('../models/site');
var Area = require('../models/area');
var Bill = require('../models/bill');
var Track = require('../models/track');
var _ = require('underscore');
var Q = require('Q');
var moment = require('moment');
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

  if (email === '') {
    return res.json(returnFailMsg('邮箱不能为空'));
  }

  if (password === '') {
    return res.json(returnFailMsg('密码不能为空'));
  }

  User.findByEmail({
    email: email
  }, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.json(returnFailMsg('没有该用户'));
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        return res.json(returnSuccessMsg(user));
      } else {
        return res.json(returnFailMsg('密码不正确'));
      }
    });
  });
};

exports.querySite = function(req, res) {
  Area.find({}, function(err, sites) {
    if (err) {
      console.log(err);
    }
    return res.json(returnSuccessMsg(sites));
  });
};

exports.querySiteDetail = function(req, res) {
  var site = req.query;
  var province = site.province;
  var city = site.city;
  var county = site.county;

  Site.findByAreas(county, function(err, sites) {
    return res.json(returnSuccessMsg(sites));
  });
};

exports.queryBills = function(req, res) {
  var bills = _.toArray(req.query);
  var len = bills.length;
  var value = [],
    count = 0;

  if (bills.length > 3) {
    return returnFailMsg('查询个数不得超过3个');
  }

  _.each(bills, function(bill, index) {
    count++;
    Bill.findById(bill, function(err, bill) {
      value.push(bill);
      if ((index + 1) === count) {
        return res.json(returnSuccessMsg(value));
      }
    });
  });
};

exports.queryTrack = function(req, res) {
  var id = req.query.bill;
  var tracklist = [];
  var billlist = _.toArray(req.query);
  var count = 0;
  var statusMap = {
    1: '已收入',
    2: '已发出',
    3: '派件中',
    4: '已签收'
  };

  if (billlist.length > 3) {
    return returnFailMsg('查询个数不得超过3个');
  }

  _.each(billlist, function(billnumber, billindex) {
    count++;
    var trackDetail = {billnumber: '',trackinfo: []};
    Track.findById(billnumber, function(err, trackObj) {
      console.log(trackObj);
      _.each(trackObj.trackinfo, function(track, index) {
        console.log(track);
        trackDetail.trackinfo.unshift(formatTrack(track));
      });
      trackDetail.billnumber = billnumber;
      tracklist.push(trackDetail);
      if ((billindex + 1) === count) {
        return res.json(returnSuccessMsg(tracklist));
      }
    });
  });

  function formatTrack(track) {
    var msg = '';
    var detail = {
      time: moment(track.time).format('YYYY-MM-DD hh:mm:ss'),
      status: statusMap[track.status],
      manager: track.manager,
      site: track.site
    };
    if (detail.status === 4) {
      msg = detail.time + ' ' + detail.site + ' ' + detail.status + ' 签收人：' + detail.manager;
    } else {
      msg = detail.time + ' ' + detail.site + ' ' + detail.status + ' 经手人：' + detail.manager;
    }
    return msg;
  }
};

exports.saveTrack = function(req, res) {
  var trackObj = req.body.track;
  var type = trackObj.type;
  var id = trackObj.id;
  var _track = null;
  var _trackinfo = null;

  if (type === 'update') {
    Track.findById(id, function(err, track) {
      if (err) {
        console.log(err);
      }
      _track = {
        site: trackObj.site,
        manager: trackObj.manager,
        status: trackObj.status,
        time: Date.now()
      };

      if (!_track.site || !_track.manager || !_track.status) {
        res.json(returnFailMsg('没有填写必选项'));
      }

      track.trackinfo.set([trackObj.index], _track);

      track.save(function(err, value) {
        return res.json(returnSuccessMsg());
      });
    });
  } else {
    _track = new Track({
      billnumber: id,
      trackinfo: []
    });
    _trackinfo = {
      site: trackObj.site,
      manager: trackObj.manager,
      status: trackObj.status,
      time: Date.now()
    };

    Track.findById(id, function(err, track) {
      if (track === null) {
        _track.save(function(err, track) {
          track.trackinfo.unshift(_trackinfo);
          track.save();
        });
      } else {
        track.trackinfo.unshift(_trackinfo);
        track.save();
      }
    });
  }

};