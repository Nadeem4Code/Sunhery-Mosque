const express = require('express');
const router = express.Router();
const {
  getExpenditures,
  createExpenditure,
  deleteExpenditure,
  updateExpenditure
} = require('../controllers/expenditureController');

router.route('/')
  .get(getExpenditures)
  .post(createExpenditure);

router.route('/:id')
  .put(updateExpenditure)
  .delete(deleteExpenditure);

module.exports = router;
