import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const readyMadeItemSchema = new mongoose.Schema({
  salesPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sales Person is required."],
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
  itemType: {
    type: String,
    enum: ["Shirt", "Trouser", "Coat", "Hanky", "Tie", "Belt", "Bow"],
    required: [true, "Item Type is required."],
  },
  paymentType: {
    type: String,
    enum: ["Cash", "Card", "Bank Transfer"],
    required: [true, "Payment Type is required."],
  },
});
//Export the model
export const ReadyMadeItem = mongoose.model(
  "ReadyMadeItem",
  readyMadeItemSchema
);
