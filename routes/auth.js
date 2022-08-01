const express = require('express');
const router = express.Router();
const passport = require('../passport/passport')

/* routes 
/ get
/login, get 
/home, none
/login-callback, post
/auth/google, 
/auth/google/callback, 
/login-saml, 
/login/callback, 
/metata 

*/

// testing

router.get('/', function (req, res, next) {
  console.log('/ ENDPOINT', req.user);

  if (!req.user ) { return res.render('home') }
  next();
}, function (req, res, next) {
  res.render('index', { user: req.user })
})

router.get('/login', function (req, res, next) {
  console.log('/login ENDPOINT', req)
  res.render('login')
})

router.post('/login/password', passport.authenticate('local', { 
  failureRedirect: '/login', 
  successRedirect: '/',
})), 

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// router.get('/', (req, res, next) => {
//   // console.log(req.user);
  
//   if(!req.user) { res.redirect('/login') }
// }, (req, res) => {
//   console.log(req.user)
//   res.render('home', { user: req.user })
// })

// router.get('/home', function (req, res, next) {
//   // console.log(req.user);
//   res.render('home')
// })

// router.get('/login', (req, res) => {
//   // console.log('test', res.locals)
//   res.render('login')
// })

// // router.post('/login/callback', passport.authenticate(['local', 'google', 'saml'], { failureRedirect: '/login', failureFlash: true }), (req, res) => {
// router.post('/login/callback', passport.authenticate('local', { 
//   successRedirect: '/home',
//   failureRedirect: '/login', 
//   failureFlash: true 
// }))
//   // , (req, res) => {
//   // console.log(req.user);
//   // res.render('home', { user: req.user })
// // })


// google auth 
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', { 
  failureRedirect: '/login', 
  successRedirect: '/' 
}));

// saml
router.get('/auth/saml', passport.authenticate('samlStrategy'));

router.post('/auth/saml/callback', passport.authenticate('samlStrategy', { 
  failureRedirect: "/login",
  successRedirect: '/',
}))

// router.post('/auth/saml/callback', passport.authenticate('samlStrategy'), (req, res) => {
  // console.log(req.user);
//   res.render('', { user: req.user })
// })

router.get('/metadata', function (req, res) {
  res.type('application/xml');
  res.status(200).send(
    passport.meta,
  );
});

module.exports = router;
// router.get('/saml/callback', passport.authenticate('saml'))

