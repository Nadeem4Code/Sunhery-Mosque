const User = require('../models/userModel');

// @desc Get all users
// @route GET /books
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc Get single user
// @route GET /books/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc Create user
// @route POST /books
const createUser = async (req, res, next) => {
  try {
    const { userName, phoneNumber, fatherName, mosque, imam, role, email, uid } = req.body;
    
    if (!userName || !phoneNumber) {
      return res.status(400).json({ message: 'UserName and phoneNumber are required' });
    }

    const newUser = await User.create({
      userName,
      phoneNumber,
      fatherName,
      role: role || 'user',
      email,
      uid,
      mosque: mosque || [],
      imam: imam || []
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// @desc Update user
// @route PUT /books/:id
const updateUser = async (req, res, next) => {
  try {
    const { userName, phoneNumber, fatherName, mosque, imam, role, email, uid } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userName !== undefined) user.userName = userName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (fatherName !== undefined) user.fatherName = fatherName;
    if (mosque !== undefined) user.mosque = mosque;
    if (imam !== undefined) user.imam = imam;
    if (role !== undefined) user.role = role;
    if (email !== undefined) user.email = email;
    if (uid !== undefined) user.uid = uid;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc Delete user
// @route DELETE /books/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Get user by Firebase UID
// @route GET /books/uid/:uid
const getUserByUid = async (req, res, next) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found for this UID' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc Register or link a user
// @route POST /books/register
const registerUser = async (req, res, next) => {
  try {
    const { uid, email, userName, role, phoneNumber, fatherName } = req.body;
    if (!uid || !email || !userName) {
      return res.status(400).json({ message: 'uid, email, and userName are required' });
    }

    // 1. Check if UID already exists
    let user = await User.findOne({ uid });
    if (user) {
      return res.status(200).json(user);
    }

    // 2. Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // 3. Check if phone number exists (to link existing offline user)
    if (phoneNumber) {
      const phoneExists = await User.findOne({ phoneNumber });
      if (phoneExists) {
        // Link the existing user to this Firebase account
        phoneExists.uid = uid;
        phoneExists.email = email;
        phoneExists.role = role || 'user';
        if (userName) phoneExists.userName = userName;
        if (fatherName) phoneExists.fatherName = fatherName;
        const linkedUser = await phoneExists.save();
        return res.status(200).json(linkedUser);
      }
    }

    // 4. Create new user
    const newUser = await User.create({
      uid,
      email,
      userName,
      role: role || 'user',
      phoneNumber: phoneNumber || '0000000000',
      fatherName: fatherName || '',
      mosque: [],
      imam: []
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUid,
  registerUser
};
