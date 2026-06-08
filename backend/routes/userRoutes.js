const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUid,
  registerUser
} = require('../controllers/userController');

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/register')
  .post(registerUser);

router.route('/uid/:uid')
  .get(getUserByUid);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
