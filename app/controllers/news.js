var mongoose = require('mongoose');
var News = mongoose.model('News');
var _ = require('underscore');
var nodejieba = require('../segment/nodejieba');

exports.news = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  News.fetchLimit(start, limit, function(err, newslist) {
    if (err) {
      next(err);
      return;
    }
    res.render('frontend/news/news', {
      title: '新闻列表',
      newslist: newslist
    });
  });
};

exports.detail = function(req, res, next) {
  var id = req.params.id;

  News.update({
    _id: id
  }, {
    $inc: {
      pv: 1
    }
  }, function(err) {
    if (err) {
      next(err);
      return;
    }
  });
  News.findById(id, function(err, news) {
    res.render('frontend/news/news_detail', {
      title: news.title + ' - 一通快递',
      news: news
    });
  });
};

exports.new = function(req, res, next) {
  res.render('backend/news/news', {
    title: '后台新闻页编辑',
    news: {
      author: '',
      title: '',
      content: ''
    }
  });
};

exports.save = function(req, res, next) {
  var id = req.body.news.id;
  var newsObj = req.body.news;
  var _news = null;

  if (id !== 'undefined') {
    News.findById(id, function(err, news) {
      if (err) {
        next(err);
        return;
      }

      var wordlist = nodejieba.queryCutSync(news.title);
      newsObj['index'] = wordlist;
      console.log(wordlist);
      _news = _.extend(news, newsObj);
      _news.save(function(err, news) {
        if (err) {
          console.log(err);
        }

        res.redirect('/admin/news/list');
      });
    });
  } else {
    _news = new News({
      author: newsObj.author,
      title: newsObj.title,
      content: newsObj.content,
      index: nodejieba.queryCutSync(newsObj.title)
    });
    _news.save(function(err, news) {
      if (err) {
        next(err);
        return;
      }

      res.redirect('/admin/news/list');
    });
  }
};

exports.update = function(req, res, next) {
  var id = req.params.id;

  if (id) {
    News.findById(id, function(err, news) {
      if (err) {
        next(err);
        return;
      }

      res.render('backend/news/news', {
        title: '新闻更新',
        news: news
      });
    });
  }
};

exports.list = function(req, res, next) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  News.fetch(function(err, newslist) {
    if (err) {
      next(err);
      return;
    }

    var len = newslist.length;

    if (len > limit) {
      newslist.length = limit;
    }

    res.render('backend/news/newslist', {
      title: '新闻列表',
      newslist: newslist,
      sum: len,
      limit: limit
    });
  });
};

exports.del = function(req, res, next) {
  var id = req.query.id;

  if (id) {
    News.remove({
      _id: id
    }, function(err, news) {
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