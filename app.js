var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var sessionConfig = {
  secret: process.env.secretKey || 'secret sauce',
  cookie: {maxAge: 60000}
};

// routes from express.router
var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var debugging = require('./routes/debugging');
var view_refugees = require('./routes/view_refugees');
var ngo_dash = require('./routes/ngo_dash');
var search_refugees = require('./routes/search_refugees'); 
var associated_person = require('./routes/associated_person');
var refugee_dashboard = require('./routes/refugee_dashboard');
var view_ref_reports = require('./routes/view_ref_reports');//change this
var reports = require('./routes/reports');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev', {
  skip() {
      return process.env.DISABLE_LOGGING == 1;
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));

app.use(function(req, res, next) {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  next();
});
app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/debugging', debugging);
app.use('/view_refugees', view_refugees);
app.use('/associated_person', associated_person);
app.use('/refugee_dashboard', refugee_dashboard);
app.use('/ngo_dash', ngo_dash);
app.use('/search_refugees', search_refugees);
app.use('/view_ref_reports', view_ref_reports);//change this
app.use('/reports', reports);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
