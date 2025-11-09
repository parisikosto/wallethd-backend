const express = require('express');

const accounts = require('./accounts');
const auth = require('./auth');
const categories = require('./categories');
const settings = require('./settings');

const router = express.Router();

router.use('/accounts', accounts);
router.use('/auth', auth);
router.use('/categories', categories);
router.use('/settings', settings);

module.exports = router;
