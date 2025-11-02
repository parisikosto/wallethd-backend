const asyncHandler = require("../middleware/asyncHandler");
const Settings = require("../models/Settings");

/**
 * @desc    Get user settings
 * @route   POST /v1/settings
 * @access  Private
 */
exports.getUserSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOne({ user: req.user.id });
  res.status(200).json(settings);
});

/**
 * @desc    Update user settings
 * @route   POST /v1/settings
 * @access  Private
 */
exports.updateUserSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(settings);
});
