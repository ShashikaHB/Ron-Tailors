import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Materials
const measurementSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  style: {
    type: String,
  },
  remarks: {
    type: String,
  },
  isNecessary: {
    type: Boolean,
    default: false,
  },
  estimatedReleaseDate: {
    type: Date,
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
  measurements: [{ type: String }],
});

measurementSchema.plugin(AutoIncrement, {
  inc_field: "measurementId",
  id: "measurements",
  start_seq: 100,
});

//Export the model
export const Measurement = mongoose.model("Measurements", measurementSchema);
