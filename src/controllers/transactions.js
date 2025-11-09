const { asyncHandler } = require('../middleware/asyncHandler');
const Transaction = require('../models/Transaction');

/**
 * @desc    Get transactions
 * @route   GET /v1/transactions
 * @access  Private
 */
const getTransactions = asyncHandler(async (_, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Create new transaction
 * @route   POST /v1/transactions
 * @access  Private
 */
const createTransaction = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;
  const transaction = await Transaction.create(req.body);
  res.status(201).json({ success: true, data: transaction });
});

module.exports = { getTransactions, createTransaction };
