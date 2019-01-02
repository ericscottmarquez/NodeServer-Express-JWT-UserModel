
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//  define the model
const userSchema = new Schema({
  //  add requirements to the strings for saving types of email 
  //  formatting inputted by user
  email: { type: String, unique: true, lowercase: true },
  password: String

});

//-------------------------------------------------------------------
// on save hook, encrypt the password
// before saving a model, this function runs
userSchema.pre('save', function(next) {
  const user = this;
    // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {return next(err); }

      user.password = hash;
      next();
    });
  });
});
//--------------------------------------------------------------------
//this next feature uses bcrypt to do what is described in passport.js
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);

  });
}


//  create the model class
const ModelClass = mongoose.model('user', userSchema);


//  export the model
module.exports = ModelClass;





