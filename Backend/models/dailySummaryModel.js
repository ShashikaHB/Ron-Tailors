import mongoose from "mongoose";

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
    cashExpense: {
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

// Post-save hook to update the 'difference' field
dailySummarySchema.post("save", function (doc, next) {
  if (doc.cashInHand !== undefined && doc.countedCash !== undefined) {
    doc.cashInHand = doc.cashIncome - doc.cashExpense;
    doc.difference = doc.cashInHand - doc.countedCash;
    doc.save().then(() => next());
  }
  next();
});

export const DailySummary = mongoose.model("DailySummary", dailySummarySchema);
