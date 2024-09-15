import mongoose from 'mongoose';

const dailySummarySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    store: {
        enum: ["RW", "KE"],
        type: String,
        required: [true, "Store Location is required."],
      },
    totalIncome: {
      type: Number,
      default: 0,
    },
    totalExpense: {
      type: Number,
      default: 0,
    },
    cardIncome: {
      type: Number,
      default: 0,
    },
    bankTransferIncome: {
      type: Number,
      default: 0,
    },
    cashIncome: {
      type: Number,
      default: 0,
    },
    cashInHand: {
      type: Number,
      default: 0, // This value will be entered manually by the user
    },
    countedCash: {
      type: Number,
      default: 0, // This value will be entered manually by the user
    },
    difference: {
      type: Number,
      default: 0, // This value will be entered manually by the user
    },
  },
  { timestamps: true }
);

export const DailySummary = mongoose.model('DailySummary', dailySummarySchema);