const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUid,
  registerUser,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getDonationStats,
  checkPhone
} = require('../controllers/userController');

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/register')
  .post(registerUser);

router.route('/uid/:uid')
  .get(getUserByUid);

router.route('/check-phone/:phoneNumber')
  .get(checkPhone);

router.route('/stats')
  .get(getDonationStats);

router.route('/payment/order')
  .post(createRazorpayOrder);

router.route('/payment/verify')
  .post(verifyRazorpayPayment);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
