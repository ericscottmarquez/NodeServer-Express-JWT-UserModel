const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

//create jwt for users
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode( { sub: user.id, iat: timestamp }, config.secret );
};

exports.signin = function(req, res, next) {
    //user has already been authenticated, now they need a token 
    res.send({ token: tokenForUser(req.user) });

}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must supply email and password'});
  }
    // SEE IF A USER WITH A GIVEN EMAIL EXISTS
    User.findOne({ email: email }, function(err, existingUser) {
      if (err) { return next(err); }

      if (existingUser) {
        return res.status(422).send({ error: 'Email is in use' });
      }

    // IF A USER WITH EXISTING EMAIL EXISTS, RETURN AN ERROR && SAVE USER
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }
      //respond to request showing a user was created, this is the token payload
      res.json({ token: tokenForUser(user) });

    });
    // RESPOND TO REQUEST  
  });
}


