const express = require('express');

const {
  getTransactions,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsSummary,
} = require('../../controllers/transactions');
const { privateAdvancedResults } = require('../../middleware/advancedResults');
const { authenticate } = require('../../middleware/auth');
const Transaction = require('../../models/Transaction');

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .get(privateAdvancedResults(Transaction), getTransactions)
  .post(createTransaction);

router.route('/summary').get(getTransactionsSummary);

router.route('/:id').get(getSingleTransaction).put(updateTransaction);

router.route('/:id').delete(deleteTransaction);

module.exports = router;
