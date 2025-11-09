const express = require('express');

const {
  getTransactions,
  createTransaction,
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

module.exports = router;
