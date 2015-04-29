var mongoose = require('mongoose');
var Bill = require('../models/bill');
//var Track = require('../models/track');
var _ = require('underscore');

exports.detail = function(req, res, next) {
  var id = req.params.id;

  Bill.findById(id, function(err, bill) {
    res.render('frontend/bill/bill_detail', {
      title: bill.title + ' - 一通快递',
      bill: bill
    });
  });
};

exports.new = function(req, res, next) {
  res.render('backend/bill/bill', {
    title: '新建快递单',
    bill: {
      sendname: '',
      sendareacode: '',
      sendtelephone: '',
      sendcellphone: '',
      sendprovince: '',
      sendcity: '',
      sendcounty: '',
      sendaddr: '',
      delivername: '',
      deliverareacode: '',
      delivertelephone: '',
      delivercellphone: '',
      deliverprovince: '',
      delivercity: '',
      delivercounty: '',
      deliveraddr: '',
      weight: '',
      freight: '',
      fragile: ''
    }
  });
};

exports.save = function(req, res, next) {
  var id = req.body.bill.id;
  var billObj = req.body.bill;
  var _bill = null;

  if (id !== 'undefined') {
    Bill.findById(id, function(err, bill) {
      if (err) {
        next(err);
        return;
      }

      _bill = _.extend(bill, billObj);
      _bill.save(function(err, bill) {
        if (err) {
          console.log(err);
        }

        res.redirect('/bill/' + bill._id);
      });
    });
  } else {
    _bill = new Bill({
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
      fragile: billObj.fragile
    });
    _bill.save(function(err, bill) {
      if (err) {
        next(err);
        return;
      }

      res.redirect('/bill/' + bill._id);
    });
  }
};

exports.update = function(req, res, next) {
  var id = req.params.id;

  if (id) {
    Bill.findById(id, function(err, bill) {
      if (err) {
        next(err);
        return;
      }

      res.render('backend/bill/bill', {
        title: '快递单信息更新',
        bill: bill
      });
    });
  }
};

exports.list = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  Bill.fetch(function(err, bills) {
    if (err) {
      next(err);
      return;
    }

    var len = bills.length;
    if(len > limit) {
      bills.length = limit;
    }

    res.render('backend/bill/billlist', {
      title: '快递列表',
      bills: bills,
      sum: len,
      limit: limit
    });
  });
};