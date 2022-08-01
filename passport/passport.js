var fs = require('fs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var SamlStrategy = require('passport-saml').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require('bcrypt');
const User = require('../db/models/User');

const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

/**
 * GOOGLE STRATEGY 
 */

// google strategy 
passport.use(new GoogleStrategy({
  clientID: '356692363028-snn486am317ss4pv7t3gubn04fcmn51v.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/auth/google/callback',
},
  async function (accessToken, refreshToken, profile, done) {
    const user = await User.findOne(profile.email);
    if (!user) { 
      return done(null, false);
    }

    return done(null, user);
  }
))

/**
 * LOCAL STRATEGY 
 */

// have to find out how to return error messages 
passport.use(new LocalStrategy(async function verify(login, password, done) {
    if (!login || !password) { 
      return done(null, false); 
    }
    
    const user = await User.findOne(login);
    if (!user) {
      return done(null, false, { message: 'no user found'});
    }

    let vPassword = await verifyPassword(password, user.e_password);
    if (!vPassword) { 
      return done(null, false);
    }

    return done(null, user, { message: 'some user'});
}))

/**
 * SAML STRATEGY 
 */

// saml strategy
var samlStrategy = new SamlStrategy({
  // config options here
  host: 'http://localhost:3001',
  callbackUrl: '/auth/saml/callback', // where the idp will post back to after success auth
  entryPoint: 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php', // idp url we send the request to 
  issuer: 'saml-poc',  // globally unique identifier for our application (i believe we hae to give this to saudi, set up when docker was run as http://app.example.com)
  identifierFormat: null,
  cert: fs.readFileSync(path.resolve(__dirname, '../certs/idp_key.pem'), 'utf8'), // idp cert
  decryptionPvk: fs.readFileSync(path.resolve(__dirname, '../certs/key.pem'), 'utf8'), // ps pk key to decrypt
  privateCert: fs.readFileSync(path.resolve(__dirname, '../certs/key.pem'), 'utf8'),  // ps pk to encrypt data
  validateInResponseTo: false, // determines if incoming saml response needs to be validated
  disableRequestedAuthnContext: true // helpful when authenticating against AD
}, async function (profile, done) {

  console.log(profile)
  // this is where to load application specific permissions from the database
  // and possible append it to the user
  const user = await User.findOne(profile.email);
  if (!user) { 
    return done(null, false);
  }

  return done(null, user);
});

passport.meta = samlStrategy.generateServiceProviderMetadata(
  fs.readFileSync(path.resolve(__dirname, '../certs/cert.pem'), 'utf8'),
  fs.readFileSync(path.resolve(__dirname, '../certs/cert.pem'), 'utf8')
)

passport.use('samlStrategy', samlStrategy)

passport.serializeUser(function (user, cb) {
  console.log('testing ser', user);

  process.nextTick(function () {
    cb(null, { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    });
  });
});

passport.deserializeUser(function (user, cb) {
  console.log('testing des', user);
  
  process.nextTick(function () {
    return cb(null, user);
  });
});

/**
 * LOCAL SERIALIZE USER
 */
// passport.serializeUser(function (user, cb) {
//   return cb(null, user)
//   // process.nextTick(function () {
//   //   return cb(null, {
//   //     id: user.id,
//   //     username: user.username,
//   //     picture: user.picture
//   //   });
//   // });
// });

// /**
//  * LOCAL DESERIALIZE USER 
//  */
// passport.deserializeUser(function (user, cb) {
//   return cb(null, user)
//   // process.nextTick(function () {
//   //   return cb(null, user);
//   // });
// });

module.exports = passport;