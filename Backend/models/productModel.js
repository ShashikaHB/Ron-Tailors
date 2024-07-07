import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    materials: [
      {
        material: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Material",
        },
        unitsNeeded: {
          type: Number,
        },
      },
    ],
    style: {
      type: String,
    },
    color: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Shirt", "Trouser", "Coat", "West Coat", "Cravat", "Bow", "Tie"],
      required: [true, "Item Type is required."],
    },
    measurements: { type: mongoose.Schema.Types.ObjectId, ref: "MeasureMents" },
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
      required: [true, "Status is required."],
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
    isNewRentOut: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.plugin(AutoIncrement, {
  inc_field: "productId",
  id: "products",
  start_seq: 100,
});
//Export the model
export const Product = mongoose.model("Product", productSchema);
