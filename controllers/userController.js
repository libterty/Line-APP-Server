const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helpers = require('../_helper');
const User = require('../database/models/user');

const userController = {
  lineCallBack: (req, res) => {
    const payload = {
      _id: helpers.getUser(req)._id,
      iat: Date.now(),
      name: helpers.getUser(req).name,
      isAdmin: false,
      blacklist: false
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      { algorithm: 'RS256' }
    );
    return res.status(200).json({
      status: 'success',
      message: 'login success',
      token,
      user: {
        id: helpers.getUser(req)._id,
        name: helpers.getUser(req).name,
        isAdmin: helpers.getUser(req).isAdmin
      }
    });
  },

  signIn: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        status: 'error',
        message: "required fields didn't exist"
      });
    }
    const userEmail = req.body.email;
    const password = req.body.password;
    User.findOne({
      email: userEmail
    }).then(user => {
      if (!user)
        return res.status(401).json({
          status: 'error',
          message: 'no such user found or passwords did not match'
        });
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          status: 'error',
          message: 'no such user found or passwords did not match'
        });
      }
      const payload = {
        _id: user._id,
        iat: Date.now(),
        name: user.name,
        isAdmin: user.isAdmin,
        blacklist: false
      };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        { algorithm: 'RS256' }
      );

      return res.status(200).json({
        status: 'success',
        message: 'Welcome Back Admin',
        token,
        user: {
          id: user._id,
          name: user.name,
          isAdmin: user.isAdmin
        }
      });
    });
  }
};

module.exports = userController;
