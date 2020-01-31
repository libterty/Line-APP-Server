const apis = require('./apis');

module.exports = app => {
  app.use('/api/v1', apis);
};
