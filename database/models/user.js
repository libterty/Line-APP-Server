const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  picture: {
    type: String
  },
  isAdmin: {
    type: Boolean
  }
});

module.exports = mongoose.model('User', userSchema);
