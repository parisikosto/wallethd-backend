const express = require('express');

const {
  getAccounts,
  getSingleAccount,
  createAccount,
  updateAccount,
  archiveAccount,
  unarchiveAccount,
  deleteAccount,
} = require('../../controllers/accounts');
const { privateAdvancedResults } = require('../../middleware/advancedResults');
const { authenticate } = require('../../middleware/auth');
const Account = require('../../models/Account');

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .get(privateAdvancedResults(Account), getAccounts)
  .post(createAccount);

router.route('/:id').get(getSingleAccount).put(updateAccount);

router.route('/:id/archive').patch(archiveAccount);
router.route('/:id/unarchive').patch(unarchiveAccount);

router.route('/:id').delete(deleteAccount);

module.exports = router;
