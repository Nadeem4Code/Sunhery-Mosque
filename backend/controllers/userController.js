const User = require('../models/userModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Helper to initialize Razorpay dynamically if environment keys are present
const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

// @desc Get all users
// @route GET /books
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().lean();
    const mappedUsers = users.map(u => ({ ...u, id: u._id.toString() }));
    res.status(200).json(mappedUsers);
  } catch (error) {
    next(error);
  }
};

// @desc Get single user
// @route GET /books/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.id = user._id.toString();
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
    let user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found for this UID' });
    }

    // Auto-promote hardcoded admin if matching phone/email
    if (user.phoneNumber === '7457861116' || user.email === '7457861116@jama-masjid.com') {
      let needsSave = false;
      if (user.role !== 'admin') {
        user.role = 'admin';
        needsSave = true;
      }
      if (user.userName !== 'Mohd Nadeem') {
        user.userName = 'Mohd Nadeem';
        needsSave = true;
      }
      if (needsSave) {
        user = await user.save();
      }
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

    const isAdmin = phoneNumber === '7457861116' || email === '7457861116@jama-masjid.com';

    // 1. Check if UID already exists
    let user = await User.findOne({ uid });
    if (user) {
      if (isAdmin || user.phoneNumber === '7457861116' || user.email === '7457861116@jama-masjid.com') {
        let needsSave = false;
        if (user.role !== 'admin') {
          user.role = 'admin';
          needsSave = true;
        }
        if (user.userName !== 'Mohd Nadeem') {
          user.userName = 'Mohd Nadeem';
          needsSave = true;
        }
        if (needsSave) {
          user = await user.save();
        }
      }
      return res.status(200).json(user);
    }

    // 2. Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      if (isAdmin || email === '7457861116@jama-masjid.com') {
        emailExists.role = 'admin';
        emailExists.userName = 'Mohd Nadeem';
        if (uid) emailExists.uid = uid;
        const savedAdmin = await emailExists.save();
        return res.status(200).json(savedAdmin);
      }
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // 3. Check if phone number exists (to link existing offline user)
    if (phoneNumber) {
      const phoneExists = await User.findOne({ phoneNumber });
      if (phoneExists) {
        // Link the existing user to this Firebase account
        phoneExists.uid = uid;
        phoneExists.email = email;
        const isUserAdmin = isAdmin || phoneNumber === '7457861116';
        phoneExists.role = isUserAdmin ? 'admin' : (role || 'user');
        if (isUserAdmin) {
          phoneExists.userName = 'Mohd Nadeem';
        } else if (userName) {
          phoneExists.userName = userName;
        }
        if (fatherName) phoneExists.fatherName = fatherName;
        const linkedUser = await phoneExists.save();
        return res.status(200).json(linkedUser);
      }
    }

    // 4. Create new user
    const newUser = await User.create({
      uid,
      email,
      userName: isAdmin ? 'Mohd Nadeem' : userName,
      role: isAdmin ? 'admin' : (role || 'user'),
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

// @desc Create Razorpay Order
// @route POST /books/payment/order
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const rzp = getRazorpayInstance();
    if (!rzp) {
      // Sandbox Mock Mode fallback
      console.log('Razorpay keys not configured. Falling back to Sandbox Mock Mode.');
      return res.status(200).json({
        isSimulated: true,
        order_id: 'mock_order_' + Math.random().toString(36).substring(2, 15),
        amount: Number(amount) * 100, // in paise
        currency: 'INR'
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    };

    const order = await rzp.orders.create(options);
    res.status(201).json({
      isSimulated: false,
      keyId: process.env.RAZORPAY_KEY_ID,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    next(error);
  }
};

// @desc Verify Razorpay Payment Signature
// @route POST /books/payment/verify
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // If it's a simulated order, we verify directly
    if (razorpay_order_id && razorpay_order_id.startsWith('mock_order_')) {
      console.log('Verifying simulated payment order:', razorpay_order_id);
      return res.status(200).json({ success: true, message: 'Simulated payment verified successfully' });
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing verification parameters' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ message: 'Razorpay secret key not configured on server' });
    }

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature verification failed' });
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    next(error);
  }
};

// @desc Get Donation Stats
// @route GET /books/stats
const getDonationStats = async (req, res, next) => {
  try {
    const { year } = req.query;
    const users = await User.find().lean();
    let totalMosqueReceived = 0;
    let totalImamReceived = 0;
    let mosqueDonors = new Set();
    let imamDonors = new Set();

    users.forEach((user) => {
      // Mosque
      if (user.mosque && Array.isArray(user.mosque)) {
        user.mosque.forEach((yearItem) => {
          if (!year || yearItem.year === year) {
            if (yearItem.months && Array.isArray(yearItem.months)) {
              yearItem.months.forEach((monthItem) => {
                if (monthItem.amount) {
                  totalMosqueReceived += Number(monthItem.amount);
                  mosqueDonors.add(user._id.toString());
                }
              });
            }
          }
        });
      }

      // Imam
      if (user.imam && Array.isArray(user.imam)) {
        user.imam.forEach((yearItem) => {
          if (!year || yearItem.year === year) {
            if (yearItem.months && Array.isArray(yearItem.months)) {
              yearItem.months.forEach((monthItem) => {
                if (monthItem.amount) {
                  totalImamReceived += Number(monthItem.amount);
                  imamDonors.add(user._id.toString());
                }
              });
            }
          }
        });
      }

      // Legacy years
      if (user.years && Array.isArray(user.years)) {
        user.years.forEach((yearItem) => {
          if (!year || yearItem.year === year) {
            if (yearItem.months && Array.isArray(yearItem.months)) {
              yearItem.months.forEach((monthItem) => {
                if (monthItem.amount) {
                  totalMosqueReceived += Number(monthItem.amount);
                  mosqueDonors.add(user._id.toString());
                }
              });
            }
          }
        });
      }
    });

    res.status(200).json({
      totalDonors: users.length,
      totalMosqueReceived,
      totalImamReceived,
      mosqueDonorsCount: mosqueDonors.size,
      imamDonorsCount: imamDonors.size
    });
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
  registerUser,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getDonationStats
};
