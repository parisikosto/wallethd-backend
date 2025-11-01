// routes/settings.js
const express = require("express");

const { getUserSettings, updateUserSettings } = require("../../controllers/settings");

const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.route("/").get(authenticate, getUserSettings).put(authenticate, updateUserSettings);

module.exports = router;
