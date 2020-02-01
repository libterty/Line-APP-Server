const passport = require('passport');
const LineStrategy = require('passport-line-auth').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../database/models/user');

passport.use(
  new LineStrategy(
    {
      channelID: process.env.channelID,
      channelSecret: process.env.channelSecret,
      callbackURL: process.env.callbackURL,
      scope: ['profile', 'openid', 'email'],
      botPrompt: 'normal'
    },
    function(accessToken, refreshToken, params, profile, cb) {
      return User.findOne({
        id: profile.id
      }).then(user => {
        if (!user) {
          new User({
            id: profile.id,
            name: profile.displayName ? profile.displayName : null,
            email: profile.email ? profile.email : null,
            picture: profile.pictureUrl ? profile.pictureUrl : null,
            isAdmin: false
          })
            .save()
            .then(user => {
              return cb(null, user);
            })
            .catch(err => {
              return cb(null, err);
            });
        } else {
          return cb(null, user);
        }
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;
