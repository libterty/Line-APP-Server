const express = require('express');
const router = express.Router();
const passport = require('../middlewares/passport');
const userController = require('../controllers/userController');
const shopConrtoller = require('../controllers/shopController');
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

router.get('/get_current_user', userController.getCurrentUser);
router.post('/admin/signin', userController.signIn);
router.get('/shops', authenticated, shopConrtoller.getShops);
router.post(
  '/shops/create',
  authenticated,
  authenticatedAdmin,
  shopConrtoller.postShops
);
router.put(
  '/shops/edit/:shopId',
  authenticated,
  authenticatedAdmin,
  shopConrtoller.putShop
);
router.delete(
  '/shops/delete/:shopId',
  authenticated,
  authenticatedAdmin,
  shopConrtoller.deleteShop
);

module.exports = router;
