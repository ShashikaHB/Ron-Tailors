import mongoose from "mongoose";

const workLogSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["Cutting Started", "Cutting Done", "Tailoring Started", "Tailoring Done"],
      required: true,
    },
    pieceType: {
      type: String,
      enum: ["Shirt", "Trouser", "Coat", "West Coat", "Cravat", "Bow", "Tie"],
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    piecePrice: {
      type: Number,
      required: true, // Ensure piece price is always stored
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });
  
  export const WorkLog = mongoose.model("WorkLog", workLogSchema);
  