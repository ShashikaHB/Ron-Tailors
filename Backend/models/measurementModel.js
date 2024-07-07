import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Materials
const measurementSchema = new mongoose.Schema(
  {
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
      required: [true, "Material unit price is required."],
    },
    estimatedReleaseDate: {
      type: Date,
    },
    itemType: {
      type: String,
      enum: ["Shirt", "Trouser", "Coat", "West Coat", "Cravat", "Bow", "Tie"],
      required: [true, "Item Type is required."],
    },
  },
  { timestamps: true }
);

measurementSchema.plugin(AutoIncrement, {
  inc_field: "measurementId",
  id: "measurements",
  start_seq: 100,
});

//Export the model
export const Measurement = mongoose.model("Measurements", measurementSchema);
