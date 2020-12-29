const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({ 
  email: { type: String, required: true, unique: true },    // On accepte une seule fois une adresse mail donnée
  password: { type: String, required: true },  
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);