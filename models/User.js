const mongoose = require('mongoose');

const emailRegex = /^(.*@(ucla\.edu|g\.ucla\.edu|uclacsc\.org))$/;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,  // email is now the superkey due to Oauth
    validate: {  // Added validation for the emails
      validator: (value) => emailRegex.test(value),
      message: props => `${props.value} is not a valid UCLA email address. Please use your UCLA email address.`
    }
  },
  uid: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: num => /^\d{9}$/.test(num),
      message: props => `Invalid uid ${props.value}`
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  }
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);
