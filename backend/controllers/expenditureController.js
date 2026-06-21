const Expenditure = require('../models/expenditureModel');

// @desc Get all expenditures
// @route GET /expenditures
const getExpenditures = async (req, res, next) => {
  try {
    const expenditures = await Expenditure.find().sort({ date: -1 }).lean();
    const mappedExpenditures = expenditures.map(e => ({ ...e, id: e._id.toString() }));
    res.status(200).json(mappedExpenditures);
  } catch (error) {
    next(error);
  }
};

// @desc Create a new expenditure
// @route POST /expenditures
const createExpenditure = async (req, res, next) => {
  try {
    const { category, amount, date, description, addedBy } = req.body;

    if (!category || amount === undefined || !date) {
      return res.status(400).json({ message: 'Category, amount, and date are required' });
    }

    // Parse the date to extract year, month, and day
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const year = parsedDate.getFullYear().toString();
    // Month is 0-indexed in JS, so we pad it and add 1
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

    const newExpenditure = await Expenditure.create({
      category,
      amount,
      date: parsedDate,
      year,
      month,
      day,
      description: description || '',
      addedBy: addedBy || 'Admin'
    });

    res.status(201).json(newExpenditure);
  } catch (error) {
    next(error);
  }
};

// @desc Delete an expenditure
// @route DELETE /expenditures/:id
const deleteExpenditure = async (req, res, next) => {
  try {
    const expenditure = await Expenditure.findById(req.params.id);
    if (!expenditure) {
      return res.status(404).json({ message: 'Expenditure record not found' });
    }

    await expenditure.deleteOne();
    res.status(200).json({ success: true, message: 'Expenditure deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Update an expenditure
// @route PUT /expenditures/:id
const updateExpenditure = async (req, res, next) => {
  try {
    const { category, amount, date, description } = req.body;
    const expenditure = await Expenditure.findById(req.params.id);

    if (!expenditure) {
      return res.status(404).json({ message: 'Expenditure record not found' });
    }

    if (category !== undefined) expenditure.category = category;
    if (amount !== undefined) expenditure.amount = Number(amount);
    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      expenditure.date = parsedDate;
      expenditure.year = parsedDate.getFullYear().toString();
      expenditure.month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      expenditure.day = String(parsedDate.getDate()).padStart(2, '0');
    }
    if (description !== undefined) expenditure.description = description;

    const updatedExpenditure = await expenditure.save();
    res.status(200).json(updatedExpenditure);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenditures,
  createExpenditure,
  deleteExpenditure,
  updateExpenditure
};
