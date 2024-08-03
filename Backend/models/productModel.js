import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
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
  measurement: { type: mongoose.Schema.Types.ObjectId, ref: "Measurements" },
  size: {
    type: Number,
  },
  cost: {
    type: Number,
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
  noOfUnits: {
    type: Number,
  },
  status: {
    type: String,
    enum: [
      "Not Started",
      "Cutting Started",
      "Cutting Done",
      "Tailoring Started",
      "Tailoring Done",
      "Ready Made",
    ],
    required: [true, "Status is required."],
  },
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
  },
});

productSchema.plugin(AutoIncrement, {
  inc_field: "productId",
  id: "products",
  start_seq: 100,
});
//Export the model
export const Product = mongoose.model("Product", productSchema);
