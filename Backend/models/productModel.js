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
  color: {
    type: String,
  },
  itemCategory: {
    type: String,
    enum: ["General", "Full Suit", "National Suit", "Rent Full Suit"],
    default: "General",
  },
  itemType: {
    type: String,
    enum: [
      "Coat",
      "National Coat",
      "West Coat",
      "Shirt",
      "Trouser",
      "Designed Trouser",
      "Designed Shirt",
      "National Shirt",
      "Rent Coat",
      "Rent West Coat",
      "Sarong",
      "Tie",
      "Bow",
      "Cravat",
      "Hanky",
      "Chain",
    ],
    required: [true, "Item Type is required."],
  },
  measurement: { type: mongoose.Schema.Types.ObjectId, ref: "Measurements" },
  size: {
    type: Number,
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
  status: {
    type: String,
    enum: [
      "Not Started",
      "Cutting Done",
      "Tailoring Started",
      "Tailoring Done",
      "Ready Made",
    ],
    required: [true, "Status is required."],
    default: "Not Started"
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
