const mongoose = require('mongoose');

const {
  transactionTypes,
  transactionStatuses,
} = require('../config/transactions');

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please add a transaction type'],
      enum: transactionTypes,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add a transaction date'],
      index: true,
    },
    dueDate: Date,
    reminderDate: Date,
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0, 'Amount must be a positive number'],
    },
    status: {
      type: String,
      required: [true, 'Please add a transaction status'],
      enum: transactionStatuses,
      index: true,
    },
    note: {
      type: String,
      required: [true, 'Please add a transaction note'],
      maxlength: [50, 'Note can not be more than 50 characters'],
      trim: true,
    },
    facility: {
      type: String,
      maxlength: [50, 'Facility can not be more than 50 characters'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description can not be more than 500 characters'],
      trim: true,
    },
    receiptTaken: {
      type: Boolean,
      default: false,
    },
    isInstallment: {
      type: Boolean,
      default: false,
    },
    isReadyToDeduct: {
      type: Boolean,
      default: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
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

// compound index for common queries (user + date)
TransactionSchema.index({ user: 1, date: -1 });

// fast filter by user + type
TransactionSchema.index({ user: 1, type: 1, date: -1 });

module.exports = mongoose.model(
  'Transaction',
  TransactionSchema,
  'transactions',
);
