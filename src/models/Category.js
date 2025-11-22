const mongoose = require('mongoose');
const slugify = require('slugify');

const { transactionTypes } = require('../config/transactions');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      maxlength: [50, 'Category name can not be more than 50 characters'],
      trim: true,
    },
    slug: {
      type: String,
      index: true,
    },
    transactionType: {
      type: String,
      required: [true, 'Please add a transaction type'],
      enum: transactionTypes,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    description: {
      type: String,
      maxlength: [
        250,
        'Category description can not be more than 250 characters',
      ],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

// virtual field to get children categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false,
});

// ensure virtuals are included in JSON output
CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

// generate slug from name
CategorySchema.pre('save', function (next) {
  if (this.isModified('name') && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

// indexes
CategorySchema.index(
  { user: 1, parent: 1, transactionType: 1, slug: 1 },
  { unique: true },
);

// secondary indexes
CategorySchema.index({ user: 1, transactionType: 1 });
CategorySchema.index({ user: 1, isArchived: 1 });

module.exports = mongoose.model('Category', CategorySchema, 'categories');
