const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an account name'],
      maxlength: [50, 'Account name can not be more than 50 characters'],
      trim: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// prevent duplicate account names per user (case-insensitive)
AccountSchema.index(
  { user: 1, name: 1 },
  {
    unique: true,
    collation: { locale: 'en', strength: 2 },
  },
);

module.exports = mongoose.model('Account', AccountSchema, 'accounts');
