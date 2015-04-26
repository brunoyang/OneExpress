var mongoose = require('mongoose');
var News = mongoose.model('News');
var _ = require('underscore');

exports.detail = function(req, res) {
  var id = req.params.id;

  News.findById(id, function(err, news) {
    res.render('frontend/news_detail', {
      title: news.title + ' - 一通快递',
      news: news
    });
  });
};

exports.new = function(req, res) {
  res.render('backend/news', {
    title: '后台新闻页编辑',
    news: {
      author: '',
      title: '',
      content: ''
    }
  });
};

exports.save = function(req, res) {
  var id = req.body.news.id;
  var newsObj = req.body.news;
  var _news = null;

  if (id !== 'undefined') {
    News.findById(id, function(err, news) {
      if (err) {
        console.log(err);
      }

      _news = _.extend(news, newsObj);
      _news.save(function(err, news) {
        if (err) {
          console.log(err);
        }

        res.redirect('/news/' + news._id);
      });
    });
  } else {
    _news = new News({
      author: newsObj.author,
      title: newsObj.title,
      content: newsObj.content
    });
    _news.save(function(err, news) {
      if (err) {
        console.log(err);
      }

      res.redirect('/news/' + news._id);
    });
  }
};

exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    News.findById(id, function(err, news) {
      if (err) {
        console.log(err);
      }

      res.render('backend/news', {
        title: '新闻更新',
        news: news
      });
    });
  }
};

exports.list = function(req, res) {
  var start = req.query.start ? req.query.start : 0;
  var limit = req.query.limit ? req.query.limit : 15;
  News.fetchLimit(start, limit, function(err, newslist){
    if(err) {
      console.log(err);
    }
    res.render('backend/newslist', {
      title: '新闻列表',
      newslist: newslist
    });
  });
};

exports.del = function(req, res) {
  var id = req.query.id;

  if (id) {
    News.remove({
      _id: id
    }, function(err, news) {
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