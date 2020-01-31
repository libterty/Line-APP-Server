const express = require('express');
const router = express.Router();
const passport = require('../middlewares/passport');
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hello World!' });
});

router.get('/auth/line', passport.authenticate('line'));

router.get(
  '/auth/line/callback',
  passport.authenticate('line', { failureRedirect: '/api/v1/auth/line' }),
  userController.lineCallBack
);

module.exports = router;
