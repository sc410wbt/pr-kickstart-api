let createError = require('http-errors');
const cookieSession = require('cookie-session')
const express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

const mongoose = require('./library/Mongoose');
mongoose.on('error', console.error.bind(console, 'connection error:'));

let app = express();
app.use(cookieSession({
    name: 'session',
    keys: ['lskdjflsdkf'],

    // Cookie Options
    maxAge: 7 * 24 * 60 * 60 * 1000 // 24 hours
}))

const allowedOrigins = [
    'https://kickstartmeeting.bbi-x.com', 'http://localhost:4000'
];

app.use(function(req, res, next) {
    let origin = req.headers.origin;
    let allowedOrigin = (allowedOrigins.indexOf(origin) > -1) ? origin : '*';
    res.header("Access-Control-Allow-Origin", allowedOrigin); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Credentials", true); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/user/request', require('./routes/user/request'));
app.use('/user/login', require('./routes/user/login'));

app.use('/mail/test', require('./routes/mail/test'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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

console.log('Starting PR Kickstart API');
module.exports = app;

