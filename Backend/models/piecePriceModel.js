import mongoose from "mongoose";

const piecePricesSchema = new mongoose.Schema({
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
    unique: true, // Each itemType must be unique
  },
  cuttingPrice: {
    type: Number,
    required: [true, "Cutting price is required."],
  },
  tailoringPrice: {
    type: Number,
    required: [true, "Tailoring price is required."],
  },
});

export const PiecePrices = mongoose.model("PiecePrices", piecePricesSchema);