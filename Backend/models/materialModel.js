import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const materialSchema = new mongoose.Schema(
  {
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
    marginPercentage: {
      type: Number,
      required: [true, "Margin Percentage is required."],
    },
    brand: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);
//Export the model
export const Material = mongoose.model("Material", materialSchema);
