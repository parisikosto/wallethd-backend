const mongoose = require('mongoose');

const { supportedCurrencies } = require('../config/transactions');

const SettingsSchema = new mongoose.Schema(
  {
    defaultCurrency: {
      type: String,
      enum: supportedCurrencies,
      default: 'EUR',
    },
    firstDayOfMonth: {
      type: Number,
      default: 1,
    },
    locale: {
      type: String,
      default: 'en-US',
    },
    showDeletedMedia: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Settings', SettingsSchema, 'settings');
