const helpers = require('../_helper');

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next();
    }
    return res
      .status(400)
      .json({ status: 'error', message: 'permission denied' });
  }
  return res
    .status(400)
    .json({ status: 'error', message: 'permission denied' });
};

module.exports = authenticatedAdmin;
