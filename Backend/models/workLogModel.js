import mongoose from "mongoose";

const workLogSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["Not Started", "Cutting Done", "Tailoring Started", "Tailoring Done"],
      required: true,
      default: "Not Started"
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  });
  
  export const WorkLog = mongoose.model("WorkLog", workLogSchema);
  