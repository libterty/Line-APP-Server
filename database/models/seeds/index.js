const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../user');
const user = require('./users.json');
const databaseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI
    : 'mongodb://127.0.0.1/line_app';

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
const db = mongoose.connection;

db.on('error', () => {
  console.log('db error');
});

db.once('open', () => {
  console.log('db connected');
  user.forEach(user => {
    const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return console.error(err);
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save();
      });
    });
  });
});
