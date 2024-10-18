import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);


// Declare the Schema of the Mongo model
const rentItemSchema = new mongoose.Schema({
  color: {
    type: String,
  },
  size: {
    type: Number,
  },
  description: {
    type: String,
    required: [true, "Total price is required."],
  },
  itemCategory: {
    type: String,
    enum: ["General", "Full Suit", "National Suit", "Rent Full Suit"],
    default: "Rent Full Suit",
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
  status: {
    type: String,
    enum: ['Rented', 'Available'],
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
