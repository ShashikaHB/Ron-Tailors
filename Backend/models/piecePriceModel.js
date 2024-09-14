import mongoose from "mongoose";

const piecePricesSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["General", "Full Suit", "National Suit", "Rent Full Suit"],
    required: [true, "Item cutting price is required."],
    unique: true, // This field must be unique
  },
  items: [
    {
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
      cuttingPrice: {
        type: Number,
        required: [true, "Item cutting price is required."],
      },
      tailoringPrice: {
        type: Number,
        required: [true, "Item cutting price is required."],
      },
    },
  ],
});

export const PiecePrices = mongoose.model("PiecePrices", piecePricesSchema);
