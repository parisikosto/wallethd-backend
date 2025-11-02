const express = require("express");

const { getUserSettings, updateUserSettings } = require("../../controllers/settings");

const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.route("/").get(getUserSettings).put(updateUserSettings);

module.exports = router;
