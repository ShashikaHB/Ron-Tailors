import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);


// Declare the Schema of the Mongo model
const rentItemSchema = new mongoose.Schema({
  color: {
    type: String,
    required: [true, "Total price is required."],
  },
  size: {
    type: Number,
  },
  description: {
    type: String,
    required: [true, "Total price is required."],
  },
  type: {
    type: String,
    enum: ["Shirt", "Trouser", "Coat", "West Coat", "Cravat", "Bow", "Tie"],
    required: [true, "Item Type is required."],
  },
  status: {
    type: String,
    enum: ['Not Returned', 'Available'],
    default: 'Available'
  }
});

rentItemSchema.plugin(AutoIncrement, {
    inc_field: "rentItemId",
    id: "rentItems",
    start_seq: 100,
  });

//Export the model
export const RentItem = mongoose.model("RentItem", rentItemSchema);
