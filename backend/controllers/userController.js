const User = require('../models/userModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const admin = require('../config/firebaseAdmin');

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
    const { userName, phoneNumber, fatherName, mosque, imam, role, email, uid, password } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If password or phoneNumber is updated, and it is a Firebase user
    if (user.uid && (password || (phoneNumber !== undefined && phoneNumber !== user.phoneNumber))) {
      if (admin.apps && admin.apps.length > 0) {
        try {
          const updateData = {};
          if (password) updateData.password = password;
          if (phoneNumber && phoneNumber !== user.phoneNumber) {
            updateData.phoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
            updateData.email = `${phoneNumber}@jama-masjid.com`;
          }
          await admin.auth().updateUser(user.uid, updateData);
          console.log(`Successfully updated Firebase credentials for user ${user.uid}`);
          if (phoneNumber && phoneNumber !== user.phoneNumber) {
            user.email = `${phoneNumber}@jama-masjid.com`;
          }
        } catch (fbError) {
          console.error('Failed to update Firebase user:', fbError.message);
          return res.status(400).json({ message: 'Failed to update user in Firebase: ' + fbError.message });
        }
      }
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

    // 1. Delete from Firebase Auth if UID exists and admin SDK is initialized
    if (user.uid && admin.apps && admin.apps.length > 0) {
      try {
        await admin.auth().deleteUser(user.uid);
        console.log(`Successfully deleted user ${user.uid} from Firebase Auth`);
      } catch (fbError) {
        console.error('Error deleting user from Firebase Auth:', fbError.message);
        // If the user doesn't exist in Firebase anymore, we still want to proceed and delete them from MongoDB
      }
    }

    // 2. Delete from MongoDB
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted successfully from both Firebase and MongoDB' });
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
    if (user.phoneNumber === process.env.SUPER_ADMIN_PHONE || user.email === process.env.SUPER_ADMIN_EMAIL) {
      let needsSave = false;
      if (user.role !== 'admin') {
        user.role = 'admin';
        needsSave = true;
      }
      if (user.userName !== process.env.SUPER_ADMIN_NAME) {
        user.userName = process.env.SUPER_ADMIN_NAME;
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

    const isAdmin = phoneNumber === process.env.SUPER_ADMIN_PHONE || email === process.env.SUPER_ADMIN_EMAIL;

    // 1. Check if UID already exists
    let user = await User.findOne({ uid });
    if (user) {
      if (isAdmin || user.phoneNumber === process.env.SUPER_ADMIN_PHONE || user.email === process.env.SUPER_ADMIN_EMAIL) {
        let needsSave = false;
        if (user.role !== 'admin') {
          user.role = 'admin';
          needsSave = true;
        }
        if (user.userName !== process.env.SUPER_ADMIN_NAME) {
          user.userName = process.env.SUPER_ADMIN_NAME;
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
      if (isAdmin || email === process.env.SUPER_ADMIN_EMAIL) {
        emailExists.role = 'admin';
        emailExists.userName = process.env.SUPER_ADMIN_NAME;
        if (uid) emailExists.uid = uid;
        const savedAdmin = await emailExists.save();
        return res.status(200).json(savedAdmin);
      }
      // Allow promoting pre-existing user if role is admin
      if (role === 'admin') {
        emailExists.role = 'admin';
        if (uid) emailExists.uid = uid;
        if (userName) emailExists.userName = userName;
        const savedAdmin = await emailExists.save();
        return res.status(200).json(savedAdmin);
      }
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // 3. Check if phone number exists (to link existing offline user)
    if (phoneNumber) {
      const phoneExists = await User.findOne({ phoneNumber });
      if (phoneExists) {
        // If registering an administrator, allow updating the UID link
        if (phoneExists.uid && phoneExists.uid !== uid && role !== 'admin') {
          return res.status(400).json({ message: 'This phone number is already registered. Please sign in.' });
        }
        // Link the existing user to this Firebase account
        phoneExists.uid = uid;
        phoneExists.email = email;
        const isUserAdmin = isAdmin || phoneNumber === process.env.SUPER_ADMIN_PHONE || role === 'admin';
        phoneExists.role = isUserAdmin ? 'admin' : (role || 'user');
        if (isUserAdmin && role !== 'admin') {
          phoneExists.userName = process.env.SUPER_ADMIN_NAME;
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
      userName: isAdmin ? process.env.SUPER_ADMIN_NAME : userName,
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

// @desc Check if phone number is already registered in MongoDB
// @route GET /books/check-phone/:phoneNumber
const checkPhone = async (req, res, next) => {
  try {
    const user = await User.findOne({ phoneNumber: req.params.phoneNumber });
    if (user && user.uid) {
      return res.status(200).json({ exists: true, message: 'This phone number is already registered. Please sign in.' });
    }
    res.status(200).json({ exists: false });
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
  getDonationStats,
  checkPhone
};
