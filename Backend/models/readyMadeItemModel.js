import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const readyMadeItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Unit price is required."],
    },
    color: {
      type: String,
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required."],
    },
    noOfUnits: {
      type: Number,
      required: [true, "Number of units is required."],
    },
    cost: {
      type: Number,
      required: [true, "Cost Percentage is required."],
    },
    type: {
      type: String,
      enum: ["Shirt", "Trouser", "Coat"],
      required: [true, "Item Type is required."],
    },
  },
  { timestamps: true }
);
//Export the model
export const ReadyMadeItem = mongoose.model(
  "ReadyMadeItem",
  readyMadeItemSchema
);
