const mongoose = require('mongoose');

const ExpenditureSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Imam',
      'Construction',
      'Maintenance & Repair',
      'Utilities & Bills'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  year: {
    type: String,
    required: [true, 'Year is required']
  },
  month: {
    type: String,
    required: [true, 'Month is required']
  },
  day: {
    type: String,
    required: [true, 'Day is required']
  },
  description: {
    type: String
  },
  addedBy: {
    type: String
  }
}, {
  timestamps: true
});

// Enable virtual id compatibility
ExpenditureSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Expenditure = mongoose.model('Expenditure', ExpenditureSchema);

module.exports = Expenditure;
