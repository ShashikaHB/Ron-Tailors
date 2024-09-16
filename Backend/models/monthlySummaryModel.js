import mongoose from "mongoose";

const monthlySummarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: {
    type: String, // e.g., "2024-09" for September 2024
    required: true,
  },
  piecesCut: [
    {
      itemType: {
        type: String, // The type of the item (e.g., "Coat", "Shirt", "Trouser")
      },
      count: {
        type: Number, // The number of pieces cut/tailored for this item type
        default: 0,
      },
    },
  ],
  piecesTailored: [
    {
      itemType: {
        type: String, // The type of the item (e.g., "Coat", "Shirt", "Trouser")
      },
      count: {
        type: Number, // The number of pieces cut/tailored for this item type
        default: 0,
      },
    },
  ],
  totalSalary: {
    type: Number,
    default: 0,
  },
  daysWorked: {
    type: Number, // Store the number of days the user worked
    default: 0,
  },
  fixedSalary: {
    type: Number,
    default: 0, // 0 means the user is not on a fixed salary
  },
  bonus: {
    type: Number,
    default: 0,
  },
});

export const MonthlySummary = mongoose.model(
  "MonthlySummary",
  monthlySummarySchema
);
