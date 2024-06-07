import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    color: {
      type: String,
    },
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
    ],
    style: {
      type: String,
      required: [true, "Style is required."],
    },
    type: {
      type: String,
      enum: ["Shirt", "Trouser", "Coat"],
      required: [true, "Item Type is required."],
    },
    measurements: [
      {
        type: String,
      },
    ],
    cost: {
      type: Number,
      required: [true, "Cost is required."],
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    noOfUnits: {
      type: Number,
      required: [true, "Number of units is required."],
    },
    status: {
      type: String,
      enum: [
        "Cutting Started",
        "Cutting Done",
        "Tailoring Started",
        "Tailoring Done",
      ],
      required: [true, "Item Type is required."],
    },
    fitOnRounds: [
      {
        type: Date,
      },
    ],
    cutter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    measurer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rentPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);
//Export the model
export const Product = mongoose.model("Product", productSchema);
