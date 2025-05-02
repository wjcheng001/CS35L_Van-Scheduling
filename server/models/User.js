const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  },
  email: {
    type: String,
    required: true
  }
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);