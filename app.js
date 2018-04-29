var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fs = require('fs');
const cons = require('consolidate');
const mongoose = require('mongoose');
const validator = require('express-validator');
mongoose.Promise = require('bluebird');

var indexRouter = require('./routes/indexRouter');
var productRouter = require('./routes/productRouter');
var usersRouter = require('./routes/usersRouter');
var createRouter = require('./routes/createRouter');
var editRouter = require('./routes/editRouter');
var categoriesRouter = require('./routes/categoriesRouter');

const url = process.env.MONGODB_URI;
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log(`Server connected`);
    console.log(process.env.TIMES);
}, (err) => { console.log(err);});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/images')));

app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/users', usersRouter);
app.use('/create', createRouter);
app.use('/edit', editRouter);
app.use('/categories', categoriesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
