var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var Complaint = require('../models/complaint');
var _ = require('underscore');
var nodejieba = require('../models/nodejieba');

exports.detail = function(req, res, next) {
  res.render('frontend/tools/complaint', {
    title:  '投诉建议 - 一通快递',
    toolsTitle: '投诉建议',
    first: 'tools'
  });
};

exports.new = function(req, res, next) {
  res.render('backend/complaint/complaint', {
    title: '新建邮件',
    complaint: {
      from: '',
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      html: ''
    }
  });
};

exports.save = function(req, res, next) {
  var complaintObj = req.body.complaint;
  var id = complaintObj.id;
  var pass = complaintObj.pass;
  var _complaint = null;

  delete complaintObj.pass;

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: complaintObj.from,
      pass: pass
    }
  });

  var mailOptions = {
    from: complaintObj.from,
    to: complaintObj.to,
    cc: complaintObj.cc || '',
    bcc: complaintObj.bcc || '',
    subject: complaintObj,
    html: complaintObj.html
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      next(err);
      return;
    }
    console.log(info);
  });

  if (id !== 'undefined') {
    Complaint.findById(id, function(err, complaint) {
      if (err) {
        next(err);
        return;
      }

      var wordlist = nodejieba.queryCutSync(complaint.subject);
      wordlist.push(nodejieba.queryCutSync(complaint.html));
      complaintObj['index'] = wordlist;

      _complaint = _.extend(complaint, complaintObj);
      _complaint.save(function(err, complaint) {
        if (err) {
          console.log(err);
        }

        res.redirect('/admin/complaint/list');
      });
    });
  } else {
    var wordlist = nodejieba.queryCutSync(complaintObj.subject);
    wordlist.push(nodejieba.queryCutSync(complaintObj.html));
    complaintObj['index'] = wordlist;

    _complaint = new Complaint({
      form: complaintObj.form,
      to: complaintObj.to,
      subject: complaintObj.subject,
      html: complaintObj.html,
      cc: complaintObj.cc,
      bcc: complaintObj.bcc,
      index: wordlist
    });

    _complaint.save(function(err, complaint) {
      if (err) {
        next(err);
        return;
      }

      res.redirect('/admin/complaint/list');
    });
  }
};

exports.reply = function(req, res, next) {
  var id = req.params.id;

  if (id) {
    Complaint.update({_id: id}, {$set: {readed: true}}, function(err){
      if (err) {
        next(err);
        return;
      }
      Complaint.findById(id, function(err, complaint) {
        if (err) {
          next(err);
          return;
        }
        res.render('backend/complaint/complaint', {
          title: '回复邮件',
          complaint: complaint
        });
      });
    });
  }
};

exports.list = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Complaint.fetch(function(err, complaintlist) {
    if (err) {
      next(err);
      return;
    }

    var len = complaintlist.length;

    if (len > limit) {
      complaintlist.length = limit;
    }

    res.render('backend/complaint/complaintlist', {
      title: '投诉建议列表',
      complaintlist: complaintlist,
      sum: len,
      limit: limit
    });
  });
};

exports.del = function(req, res, next) {
  var id = req.query.id;

  if (id) {
    Complaint.remove({
      _id: id
    }, function(err, complaint) {
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