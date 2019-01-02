
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');



//create local strategy
const localOptions = { usernameField: 'email' }; 
const localLogin = new LocalStrategy({ localOptions }, function(email, password, done) {

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


