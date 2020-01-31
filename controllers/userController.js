const jwt = require('jsonwebtoken');
const helpers = require('../_helper');

const userController = {
  lineCallBack: (req, res) => {
    const payload = {
      _id: helpers.getUser(req)._id,
      iat: Date.now(),
      name: helpers.getUser(req).name,
      isAdmin: helpers.getUser(req).isAdmin,
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
  }
};

module.exports = userController;
