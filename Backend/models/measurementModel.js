import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
import { ItemCategories, ItemTypes } from "../enums/common.js";

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
    enum: ItemCategories,
    default: "General",
  },
  itemType: {
    type: String,
    enum: ItemTypes,
    required: [true, "Item Type is required."],
  },
  measurements: [{ type: String }],
  isPrinted: {
    type: Boolean,
    default: false
  }
});

measurementSchema.plugin(AutoIncrement, {
  inc_field: "measurementId",
  id: "measurements",
  start_seq: 100,
});

//Export the model
export const Measurement = mongoose.model("Measurements", measurementSchema);
