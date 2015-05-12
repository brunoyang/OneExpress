var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var port = process.env.PORT || 3003;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dbUrl = 'mongodb://localhost/oneexpress';

mongoose.connect(dbUrl);

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {
  flags: 'a'
});
var errorLog = fs.createWriteStream('error.log', {
  flags: 'a'
});

var models_path = __dirname + '/app/models';
var walk = function(path) {
  fs.readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(stat)) {
          require(newPath);
        }
      } else if (stat.isDirectory()) {
        walk(newPath);
      }
    });
};
walk(models_path);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(multipart());
app.use(session({
  secret: 'oneexpress',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  },
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' === app.get('env')) {
  app.set('showStackError', true);
  app.use(logger(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

require('./config/routes')(app);
require('./config/service')(io);


// app.use(function(err, req, res, next) {
//   var meta = '[' + new Date() + '] ' + req.url + '\n';
//   errorLog.write(meta + err.stack + '\n');
//   next();
// });

app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', {
      url: req.url
    });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({
      error: 'Not found'
    });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.use(function(err, req, res, next) {
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  console.log(err.stack);
  res.status(err.status || 500);
  res.render('500', {
    error: err
  });
});

app.locals.moment = require('moment');
http.listen(port, function(){
  console.log('listening on *:3003');
});
// app.listen(port);