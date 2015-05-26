var Ad = require('../models/ad');
var Hr = require('../models/hr');
var Area = require('../models/area');
var Bill = require('../models/bill');
var News = require('../models/news');
var Page = require('../models/page');
var Site = require('../models/site');
var User = require('../models/user');
var Track = require('../models/track');
var Contraband = require('../models/contraband');
var Complaint = require('../models/complaint');
var nodejieba = require('../models/nodejieba');
var _ = require('underscore');
var moment = require('moment');
var rUsername = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
var rEmail = /([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i;

var ModelList = {
  'ad': Ad,
  'hr': Hr,
  'area': Area,
  'bill': Bill,
  'news': News,
  'page': Page,
  'site': Site,
  'user': User,
  'track': Track,
  'contraband': Contraband,
  'complaint': Complaint
};

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

exports.checkEmail = function(req, res, next) {
  var email = req.query.email;

  if (rEmail.test(email)) {
    User.findByEmail(email, function(err, user) {
      if (err) {
        return res.json(returnFailMsg('Server Error'));
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

exports.checkUser = function(req, res, next) {
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
      return res.json(returnFailMsg('Server Error'));
    }
    if (!user) {
      return res.json(returnFailMsg('没有该用户'));
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        next(err);
        return;
      }
      if (isMatch) {
        return res.json(returnSuccessMsg(user));
      } else {
        return res.json(returnFailMsg('密码不正确'));
      }
    });
  });
};

exports.queryContraband = function(req, res, next) {
  var name = req.query.name;

  Contraband.findByName(name, function(err, result) {
    if (err) {
      return res.json(returnFailMsg('Server Error'));
    }
    return res.json(returnSuccessMsg(result));
  });
};

exports.querySite = function(req, res, next) {
  Area.find({}, function(err, sites) {
    if (err) {
      return res.json(returnFailMsg('Server Error'));
    }
    return res.json(returnSuccessMsg(sites));
  });
};

exports.querySiteDetail = function(req, res, next) {
  var site = req.query;
  var province = site.province;
  var city = site.city;
  var county = site.county;

  Site.findByAreas('county', county, function(err, sites) {
    if (err) {
      return res.json(returnFailMsg('Server Error'));
    }
    return res.json(returnSuccessMsg(sites));
  });
};

exports.queryBills = function(req, res, next) {
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
    }, ['index']);
  });
};

exports.queryTrack = function(req, res, next) {
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
    var trackDetail = {
      billnumber: '',
      trackinfo: []
    };
    Track.findById(billnumber, function(err, trackObj) {
      if (err) {
        return res.json(returnFailMsg('Server Error'));
      }

      if (trackObj !== null) {
        _.each(trackObj.trackinfo, function(track, index) {
          trackDetail.trackinfo.unshift(formatTrack(track));
        });
      } else {
        trackDetail.trackinfo.unshift(formatTrack(trackObj));
      }

      trackDetail.billnumber = billnumber;
      tracklist.push(trackDetail);
      if ((billindex + 1) === count) {
        return res.json(returnSuccessMsg(tracklist));
      }
    });
  });

  function formatTrack(track) {
    var msg = '';
    if (track !== null) {
      var detail = {
        time: moment(track.time).format('YYYY-MM-DD HH:mm:ss'),
        status: statusMap[track.status],
        manager: track.manager,
        site: track.site
      };
      if (detail.status === 4) {
        msg = detail.time + ' ' + detail.site + ' ' + detail.status + ' 签收人：' + detail.manager;
      } else {
        msg = detail.time + ' ' + detail.site + ' ' + detail.status + ' 经手人：' + detail.manager;
      }
    } else {
      msg = '目前暂时没有快递信息';
    }
    return msg;
  }
};

exports.saveTrack = function(req, res, next) {
  var trackObj = req.body.track;
  var type = trackObj.type;
  var id = trackObj.id;
  var _track = null;
  var _trackinfo = null;

  if (type === 'update') {
    Track.findById(id, function(err, track) {
      if (err) {
        return res.json(returnFailMsg('Server Error'));
      }
      _track = {
        site: trackObj.site,
        manager: trackObj.manager,
        status: trackObj.status,
        time: Date.now()
      };

      if (!_track.site || !_track.manager || !_track.status) {
        return res.json(returnFailMsg('没有填写必选项'));
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
          track.save(function() {
            return res.json(returnSuccessMsg());
          });
        });
      } else {
        track.trackinfo.unshift(_trackinfo);
        track.save(function() {
          return res.json(returnSuccessMsg());
        });
      }
    });
  }
};

exports.saveComplaint = function(req, res, next) {
  var email = req.body;
  var index = [email.to, nodejieba.queryCutSync(email.subject), nodejieba.queryCutSync(email.html)];
  var complaint = new Complaint({
    to: email.to,
    subject: email.subject,
    html: email.html,
    index: index
  });
  complaint.save(function(err, result) {
    if (err) {
      next(err);
      return res.json(returnFailMsg('Server Error'));
    } else {
      return res.json(returnSuccessMsg());
    }
  });
};

exports.saveBill = function(req, res, next) {
  var billObj = req.body.bill;
  var _bill = new Bill({
    sendname: billObj.sendname,
    sendareacode: billObj.sendareacode,
    sendtelephone: billObj.sendtelephone,
    sendcellphone: billObj.sendcellphone,
    sendprovince: billObj.sendprovince,
    sendcity: billObj.sendcity,
    sendcounty: billObj.sendcounty || '',
    sendaddr: billObj.sendaddr,
    delivername: billObj.delivername,
    deliverareacode: billObj.deliverareacode,
    delivertelephone: billObj.delivertelephone,
    delivercellphone: billObj.delivercellphone,
    deliverprovince: billObj.deliverprovince,
    delivercity: billObj.delivercity,
    delivercounty: billObj.delivercounty || '',
    deliveraddr: billObj.deliveraddr,
    weight: billObj.weight,
    freight: billObj.freight,
    fragile: billObj.fragile,
    index: _.toArray(billObj)
  });
  _bill.save(function(err, bill) {
    if (err) {
      return res.json(returnFailMsg('Server Error'));
    } else {
      return res.json(returnSuccessMsg({billnumber: bill._id}));
    }
  });
};

exports.getList = function(req, res, next) {
  var query = req.query;
  var type = query.type;
  var start = query.start;
  var limit = query.limit;

  ModelList[type].fetchLimit(start, limit, function(err, result) {
    if (err) {
      return res.json(returnFailMsg('Server Error'));
    }

    return res.json(returnSuccessMsg(result));
  });
};

exports.search = function(req, res, next) {
  var words = req.query.word;
  var type = req.query.type;

  var wordlist = _.unique(words.split(' '));
  if (_.indexOf(wordlist, '') !== -1) {
    wordlist.splice(_.indexOf(wordlist, ''), 1);
  }

  ModelList[type].search(wordlist, function(err, data) {
    return res.json(returnSuccessMsg(data));
  });
};