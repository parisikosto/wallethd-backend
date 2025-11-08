const express = require("express");

const {
  getCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  archiveCategory,
  unarchiveCategory,
  deleteCategory,
} = require("../../controllers/categories");

const { privateAdvancedResults } = require("../../middleware/advancedResults");
const { authenticate } = require("../../middleware/auth");

const Category = require("../../models/Category");

const router = express.Router();

router.use(authenticate);

router
  .route("/")
  .get(privateAdvancedResults(Category), getCategories)
  .post(createCategory);

router.route("/:id").get(getSingleCategory).put(updateCategory);

router.route("/:id/archive").patch(archiveCategory);
router.route("/:id/unarchive").patch(unarchiveCategory);

router.route("/:id").delete(deleteCategory);

module.exports = router;
