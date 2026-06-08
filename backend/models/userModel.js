const mongoose = require('mongoose');

const MonthSchema = new mongoose.Schema({
  day: { type: String },
  month: { type: String },
  amount: { type: Number }
}, { _id: false });

const YearSchema = new mongoose.Schema({
  year: { type: String },
  months: [MonthSchema]
}, { _id: false });

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'UserName is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  fatherName: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  uid: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  mosque: [YearSchema],
  imam: [YearSchema]
}, {
  timestamps: true
});

// Enable virtual id and strip __v / _id from JSON responses for frontend compatibility
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

UserSchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
