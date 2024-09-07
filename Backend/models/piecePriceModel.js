import mongoose from "mongoose";

const piecePricesSchema = new mongoose.Schema({
  Shirt: {
    type: Number,
    required: [true, "Shirt price is required."],
  },
  Trouser: {
    type: Number,
    required: [true, "Trouser price is required."],
  },
  Coat: {
    type: Number,
    required: [true, "Coat price is required."],
  },
  WestCoat: {
    type: Number,
    required: [true, "West Coat price is required."],
  },
  Cravat: {
    type: Number,
    required: [true, "Cravat price is required."],
  },
  Bow: {
    type: Number,
    required: [true, "Bow price is required."],
  },
  Tie: {
    type: Number,
    required: [true, "Tie price is required."],
  },
  type: {
    type: String,
    required: [true, "Type is required."],
    enum: ["Cutting", "Tailoring"],
    unique: true,  // Ensure the 'type' field is unique across the collection
    default: "Cutting",
  },
});

export const PiecePrices = mongoose.model("PiecePrices", piecePricesSchema);
