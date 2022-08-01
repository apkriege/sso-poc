var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
var createError = require('http-errors');
var passport = require('./passport/passport');
// var flash = require('connect-flash');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// app.use(passport.authenticate('session'))
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());

const authRoutes = require('./routes/auth')
app.use('/', authRoutes)

/// catch all methods
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = app.listen(3001, function () {
  console.log('Listening on port %d', server.address().port);
})

// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     console.log(req.user)
//     // Successful authentication, redirect home.
//     // res.redirect('/');
//     res.render('home', {user: req.user })
//   });

// app.get('/', function (req, res) {
//   // console.log(req.user)
//   res.render('home', {user: null})
//   // res.send('logged in and good to go')
//   // console.log(req)
// })

// app.get('/login', function (req, res) {
//   res.render('login')
// })

// app.post('/login/password', passport.authenticate('local', { /*successRedirect: '/',*/ failureRedirect: '/login' }), function (req, res) {
//   // res.send('testing')
//   res.render('home', {user: req.user})
// })

// // working
// app.get('/login-saml', function (req, res, next) {
//   console.log('======================'),
//     console.log('/Start login handler');
//   next();
// }, passport.authenticate('samlStrategy', { failureRedirect: "/login", failureFlash: true }), function (req, res) {
//   res.redirect("/login")
// })

// app.post('/login/callback', function (req, res, next) {
//   console.log('-----------------------------');
//   console.log('/Start login callback ');
//   next();
// }, passport.authenticate('samlStrategy'), function (req, res) {
//   console.log('-----------------------------');
//   console.log('login call back dumps');
//   console.log(req.user);
//   console.log('-----------------------------');
//   // res.send('Log in Callback Success');

//   // res.user = req.user
//   // res.redirect('/')
//   res.render('home', { user: req.user })
// });

// app.get('/metadata', function (req, res) {
//   res.type('application/xml');
//   res.status(200).send(
//     passport.meta,
//   );
// });
