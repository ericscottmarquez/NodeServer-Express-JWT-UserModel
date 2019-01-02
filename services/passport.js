const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//create local strategy
const localOptions = { usernameField: 'email' }; 
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    //verify username+password, call done with user, OTHERWISE: call done when false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    //compare the passwords to see if equal to user.password + decode encrypted password using bcrypt
    //this encrypts the pass, turns it into a hash, and compares new hash to original saved signup hash
    //this is done here and ins user.js under the password hashing feature.
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);

    }); 
  });
});


//set up options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
//see if the userID in payload exists in DB, if yes, call 'done' with
//that thing, otherwise, call done without a user object, this means no user not valid
  User.findById(payload.sub, function(err, user) {
      if (err) { return done(err, false); }

      if (user) {
        done(null, user); }
      else {
        done(null, false); }
  });
}); 

//tell passport to use the strategy
passport.use(jwtLogin);
passport.use(localLogin);



