const mongoose = require('mongoose');

const { asyncHandler } = require('../middleware/asyncHandler');
const Settings = require('../models/Settings');
const Transaction = require('../models/Transaction');
const { toSmallestUnit } = require('../utils/currency');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * Helper function to get user's currency from settings
 */
async function getUserCurrency(userId) {
  const settings = await Settings.findOne({ user: userId });
  return settings?.defaultCurrency || 'EUR';
}

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
  }).populate(Transaction.getPopulateOptions());

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
const createTransaction = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  if (req.body.amount !== undefined) {
    const decimalAmount = parseFloat(req.body.amount);
    if (isNaN(decimalAmount)) {
      return next(new ErrorResponse('Invalid amount value', 400));
    }

    const currency = await getUserCurrency(req.user.id);
    req.body.amount = toSmallestUnit(decimalAmount, currency);
  }

  const transaction = await Transaction.create(req.body);
  await transaction.populateDefault();

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

  if (req.body.amount !== undefined) {
    const decimalAmount = parseFloat(req.body.amount);
    if (isNaN(decimalAmount)) {
      return next(new ErrorResponse('Invalid amount value', 400));
    }

    const currency = await getUserCurrency(req.user.id);
    req.body.amount = toSmallestUnit(decimalAmount, currency);
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
  await transaction.populateDefault();

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

/**
 * @desc    Get transactions for a year grouped by month
 * @route   GET /v1/transactions/monthly
 * @access  Private
 */
const getTransactionsByMonth = asyncHandler(async (req, res, next) => {
  const { year } = req.query;
  const currentYear = new Date().getFullYear();
  const yearNum = year ? parseInt(year, 10) : currentYear;

  if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
    return next(new ErrorResponse('Invalid year parameter', 400));
  }

  const matchStage = {
    user: mongoose.Types.ObjectId.createFromHexString(req.user.id),
    date: {
      $gte: new Date(`${yearNum}-01-01`),
      $lt: new Date(`${yearNum + 1}-01-01`),
    },
  };

  const transactions = await Transaction.find(matchStage)
    .populate(Transaction.getPopulateOptions())
    .sort({ date: 1 });

  const monthlyData = Array.from({ length: 12 }, () => ({
    expenses: [],
    incomes: [],
  }));

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const monthIndex = transactionDate.getMonth();

    if (monthIndex >= 0 && monthIndex < 12) {
      const monthData = monthlyData[monthIndex];
      const transactionObj = transaction.toObject();

      transactionObj.amountDecimal = transactionObj.amount / 100;

      if (transaction.type === 'income') {
        monthData.incomes.push(transactionObj);
      } else if (transaction.type === 'expense') {
        monthData.expenses.push(transactionObj);
      }
    }
  });

  monthlyData.forEach((monthData) => {
    monthData.incomes.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    monthData.expenses.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const totalIncome = monthData.incomes.reduce(
      (sum, t) => sum + t.amountDecimal,
      0,
    );
    const totalExpenses = monthData.expenses.reduce(
      (sum, t) => sum + t.amountDecimal,
      0,
    );

    const budgetForNecessities = totalIncome * 0.5;
    const wantsBudget = totalIncome * 0.3;
    const expectedSavings = totalIncome * 0.2;

    const isOverBudget = totalExpenses > budgetForNecessities;
    const actualSavings = totalIncome - totalExpenses - wantsBudget;
    const isOnTrack = actualSavings >= expectedSavings;

    monthData.totalIncome = totalIncome;
    monthData.totalExpenses = totalExpenses;
    monthData.budgetForNecessities = budgetForNecessities;
    monthData.wantsBudget = wantsBudget;
    monthData.expectedSavings = expectedSavings;
    monthData.isOverBudget = isOverBudget;
    monthData.actualSavings = actualSavings;
    monthData.isOnTrack = isOnTrack;
  });

  res.status(200).json({
    success: true,
    data: monthlyData,
  });
});

/**
 * @desc    Get transactions summary
 * @route   GET /v1/transactions/summary
 * @access  Private
 */
const getTransactionsSummary = asyncHandler(async (req, res, next) => {
  const { year } = req.query;

  const matchStage = {
    user: mongoose.Types.ObjectId.createFromHexString(req.user.id),
  };

  if (year) {
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      return next(new ErrorResponse('Invalid year parameter', 400));
    }

    matchStage.date = {
      $gte: new Date(`${yearNum}-01-01`),
      $lt: new Date(`${yearNum + 1}-01-01`),
    };
  }

  const summary = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          type: '$type',
          status: '$status',
        },
        total: { $sum: '$amount' },
      },
    },
  ]);

  const results = {
    totalIncome: 0,
    completedIncome: 0,
    pendingIncome: 0,
    totalExpenses: 0,
    completedExpenses: 0,
    pendingExpenses: 0,
  };

  summary.forEach((item) => {
    const { type, status } = item._id;
    const amount = item.total;

    if (type === 'income') {
      results.totalIncome += amount;
      if (status === 'completed') {
        results.completedIncome = amount;
      } else if (status === 'pending') {
        results.pendingIncome = amount;
      }
    } else if (type === 'expense') {
      results.totalExpenses += amount;
      if (status === 'completed') {
        results.completedExpenses = amount;
      } else if (status === 'pending') {
        results.pendingExpenses = amount;
      }
    }
  });

  Object.keys(results).forEach((key) => {
    results[key] = results[key] / 100;
  });

  res.status(200).json({
    success: true,
    data: results,
  });
});

module.exports = {
  getTransactions,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByMonth,
  getTransactionsSummary,
};
