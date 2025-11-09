const { asyncHandler } = require('../middleware/asyncHandler');
const Account = require('../models/Account');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Get accounts
 * @route   GET /v1/accounts
 * @access  Private
 */
const getAccounts = asyncHandler(async (_, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single account
 * @route   GET /v1/accounts/:id
 * @access  Private
 */
const getSingleAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!account) {
    return next(
      new ErrorResponse(`Account with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: account });
});

/**
 * @desc    Add new account
 * @route   POST /v1/accounts
 * @access  Private
 */
const createAccount = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const account = await Account.create({
    user: req.user.id,
    name,
  });

  res.status(201).json({ success: true, data: account });
});

/**
 * @desc    Update account
 * @route   PUT /v1/accounts/:id
 * @access  Private
 */
const updateAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!account) {
    return next(
      new ErrorResponse(`Account with id ${req.params.id} not found`, 404),
    );
  }

  const updatableFields = ['name', 'isArchived', 'order'];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      account[field] = req.body[field];
    }
  });

  await account.save();

  res.status(200).json({ success: true, data: account });
});

/**
 * @desc    Archive account
 * @route   PATCH /v1/accounts/:id/archive
 * @access  Private
 */
const archiveAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isArchived: true },
    { new: true },
  );

  if (!account) {
    return next(
      new ErrorResponse(`Account with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: account });
});

/**
 * @desc    Unarchive account
 * @route   PATCH /v1/accounts/:id/unarchive
 * @access  Private
 */
const unarchiveAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isArchived: false },
    { new: true },
  );

  if (!account) {
    return next(
      new ErrorResponse(`Account with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: account });
});

/**
 * @desc    Delete account
 * @route   DELETE /v1/accounts/:id
 * @access  Private
 */
const deleteAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!account) {
    return next(
      new ErrorResponse(`Account with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getAccounts,
  getSingleAccount,
  createAccount,
  updateAccount,
  archiveAccount,
  unarchiveAccount,
  deleteAccount,
};
