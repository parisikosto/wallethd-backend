const { asyncHandler } = require('../middleware/asyncHandler');
const Category = require('../models/Category');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Get categories
 * @route   GET /v1/categories
 * @access  Private
 */
const getCategories = asyncHandler(async (_, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single category
 * @route   GET /v1/categories/:id
 * @access  Private
 */
const getSingleCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!category) {
    return next(
      new ErrorResponse(`Category with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: category });
});

/**
 * @desc    Add new category
 * @route   POST /v1/categories
 * @access  Private
 */
const createCategory = asyncHandler(async (req, res, next) => {
  const { name, transactionType, parent, description } = req.body;

  if (parent) {
    const foundParentCategory = await Category.findOne({
      _id: parent,
      user: req.user.id,
    });

    if (!foundParentCategory) {
      return next(
        new ErrorResponse(`Parent category with id ${parent} not found`, 404),
      );
    }
  }

  const category = await Category.create({
    user: req.user.id,
    name,
    transactionType,
    parent: parent || null,
    description,
  });

  res.status(201).json({ success: true, data: category });
});

/**
 * @desc    Update category
 * @route   PUT /v1/categories/:id
 * @access  Private
 */
const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!category) {
    return next(
      new ErrorResponse(`Category with id ${req.params.id} not found`, 404),
    );
  }

  const updatableFields = [
    'name',
    'transactionType',
    'parent',
    'description',
    'isArchived',
    'order',
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      category[field] = req.body[field];
    }
  });

  if (req.body.parent) {
    const foundParentCategory = await Category.findOne({
      _id: req.body.parent,
      user: req.user.id,
    });

    if (!foundParentCategory) {
      return next(
        new ErrorResponse(
          `Parent category with id ${req.body.parent} not found`,
          404,
        ),
      );
    }

    category.parent = foundParentCategory._id;
  }

  await category.save();

  res.status(200).json({ success: true, data: category });
});

/**
 * @desc    Archive category
 * @route   PATCH /v1/categories/:id/archive
 * @access  Private
 */
const archiveCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isArchived: true },
    { new: true },
  );

  if (!category) {
    return next(
      new ErrorResponse(`Category with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: category });
});

/**
 * @desc    Unarchive category
 * @route   PATCH /v1/categories/:id/unarchive
 * @access  Private
 */
const unarchiveCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isArchived: false },
    { new: true },
  );

  if (!category) {
    return next(
      new ErrorResponse(`Category with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: category });
});

/**
 * @desc    Delete category
 * @route   DELETE /v1/categories/:id
 * @access  Private
 */
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!category) {
    return next(
      new ErrorResponse(`Category with id ${req.params.id} not found`, 404),
    );
  }

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  archiveCategory,
  unarchiveCategory,
  deleteCategory,
};
