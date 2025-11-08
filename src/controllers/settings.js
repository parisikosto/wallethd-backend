const { asyncHandler } = require('../middleware/asyncHandler');
const Settings = require('../models/Settings');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Get settings
 * @route   GET /v1/settings
 * @access  Private
 */
const getSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.findOne({ user: req.user.id });

  if (!settings) {
    return next(new ErrorResponse(`Settings not found`, 404));
  }

  res.status(200).json({ success: true, data: settings });
});

/**
 * @desc    Update settings
 * @route   PUT /v1/settings
 * @access  Private
 */
const updateSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.findOne({ user: req.user.id });

  if (!settings) {
    return next(new ErrorResponse(`Settings not found`, 404));
  }

  const updatableFields = [
    'defaultCurrency',
    'firstDayOfMonth',
    'locale',
    'showDeletedMedia',
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  });

  await settings.save();

  res.status(200).json({ success: true, data: settings });
});

module.exports = { getSettings, updateSettings };
