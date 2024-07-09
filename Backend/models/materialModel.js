import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Materials
const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Material name is required."],
  },
  color: {
    type: String,
    required: [true, "Material color is required."],
  },
  unitPrice: {
    type: Number,
    required: [true, "Material unit price is required."],
  },
  noOfUnits: {
    type: Number,
    required: [true, "Number of units is required."],
  },
  marginPercentage: {
    type: Number,
    required: [true, "Margin percentage is required."],
  },
  brand: {
    type: String,
    required: [true, "Brand is required."],
  },
  type: {
    type: String,
  },
});

materialSchema.plugin(AutoIncrement, {
  inc_field: "materialId",
  id: "materials",
  start_seq: 100,
});

//Export the model
export const Material = mongoose.model("Material", materialSchema);
