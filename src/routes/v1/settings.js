const express = require('express');

const { getSettings, updateSettings } = require('../../controllers/settings');
const { authenticate } = require('../../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.route('/').get(getSettings).put(updateSettings);

module.exports = router;
