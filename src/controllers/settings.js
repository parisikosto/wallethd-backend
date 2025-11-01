const Settings = require("../models/Settings");

/**
 * @desc    Get user settings
 * @route   POST /v1/settings
 * @access  Private
 */
exports.getUserSettings = async (req, res) => {
  const settings = await Settings.findOne({ user: req.user.id });
  res.json(settings);
};

/**
 * @desc    Update user settings
 * @route   POST /v1/settings
 * @access  Private
 */
exports.updateUserSettings = async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  res.json(settings);
};
