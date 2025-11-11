const { asyncHandler } = require('../middleware/asyncHandler');
const Transaction = require('../models/Transaction');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Get transactions
 * @route   GET /v1/transactions
 * @access  Private
 */
const getTransactions = asyncHandler(async (_, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single transaction
 * @route   GET /v1/transactions/:id
 * @access  Private
 */
const getSingleTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!transaction) {
    return next(
      new ErrorResponse(`Transaction with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: transaction });
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

/**
 * @desc    Update transaction
 * @route   PUT /v1/transactions/:id
 * @access  Private
 */
const updateTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!transaction) {
    return next(
      new ErrorResponse(`Transaction with id ${req.params.id} not found`, 404),
    );
  }

  const updatableFields = [
    'type',
    'date',
    'dueDate',
    'reminderDate',
    'amount',
    'status',
    'note',
    'facility',
    'description',
    'receiptTaken',
    'isInstallment',
    'isReadyToDeduct',
    'attachments',
    'website',
    'account',
    'category',
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      transaction[field] = req.body[field];
    }
  });

  await transaction.save();

  res.status(200).json({ success: true, data: transaction });
});

/**
 * @desc    Delete transaction
 * @route   DELETE /v1/transactions/:id
 * @access  Private
 */
const deleteTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!transaction) {
    return next(
      new ErrorResponse(`Transaction with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getTransactions,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
