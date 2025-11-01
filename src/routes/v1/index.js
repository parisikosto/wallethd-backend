const express = require("express");

const auth = require("./auth");
const settings = require("./settings");

const router = express.Router();

router.use("/auth", auth);
router.use("/settings", settings);

module.exports = router;