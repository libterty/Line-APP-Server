const express = require('express');
const router = express.Router();
const passport = require('../middlewares/passport');
const userController = require('../controllers/userController');
const passportJWT = require('../middlewares/jwt');
const authenticatedAdmin = require('../middlewares/admin');
const authenticated = passportJWT.authenticate('jwt', { session: false });

router.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hello World!' });
});

router.get('/test', authenticated, (req, res) => {
  res.status(200).json({ status: 'success', message: 'authenticated test' });
});

router.get('/auth/line', passport.authenticate('line'));

router.get(
  '/auth/line/callback',
  passport.authenticate('line', { failureRedirect: '/api/v1/auth/line' }),
  userController.lineCallBack
);

router.get('/admin/test', authenticated, authenticatedAdmin, (req, res) => {
  res
    .status(200)
    .json({ status: 'success', message: 'admin authenticated test' });
});

router.post('/admin/signin', userController.signIn);

module.exports = router;
