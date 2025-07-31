const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schéma pour profil User //
const userSchema = mongoose.Schema({

  email: { type: String, required: true, unique: true },
  admin : { type: Boolean, required: true, default: false}, 
  password: { type: String, required: true }

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);