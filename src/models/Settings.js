const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    defaultCurrency: {
      type: String,
      default: "EUR",
    },
    firstDayOfMonth: {
      type: Number,
      default: 1,
    },
    locale: {
      type: String,
      default: "en-US",
    },
    showDeletedMedia: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema, "settings");
