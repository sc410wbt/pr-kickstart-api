// let mediaDir = __dirname.replace('/api', '/media');
// mediaDir = mediaDir.replace('/production', '/');
// mediaDir = mediaDir.replace('/staging', '/');
// global.__mediadir = mediaDir;
// global.siteName = 'PR Kickstart';

let createError = require('http-errors');
const cookieSession = require('cookie-session')
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

const mongoose = require('./library/Mongoose');
mongoose.on('error', console.error.bind(console, 'connection error:'));

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// File uploading
// let serveStatic = require( "serve-static" );
// if (process.platform === 'linux') app.use('/media', serveStatic('/var/www/media'));
// else app.use('/media', serveStatic('/Users/sun/Work/Mulias/Sites/mulias.com/media'));

const fileupload = require('express-fileupload');
app.use(fileupload()); // Required to handle fetch requests multipart

app.use(cookieSession({
    name: 'session',
    keys: ['prkickstart'],
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

app.use('/', require('./routes/index'));

app.use('/user/request', require('./routes/user/request'));
app.use('/user/login', require('./routes/user/login'));
app.use('/user/logout', require('./routes/user/logout'));

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

