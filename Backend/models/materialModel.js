import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Materials
const materialSchema = new mongoose.Schema({
  materialId: {
    type: String,
  },
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
  store: {
    enum: ["RW", "KE"],
    type: String,
    required: [true, "Store Location is required."],
  },
  brand: {
    type: String,
    required: [true, "Brand is required."],
  },
});

materialSchema.plugin(AutoIncrement, {
  inc_field: "material_seq",
  id: "materials",
  start_seq: 100,
});

materialSchema.post("save", function (doc, next) {
  if (!doc.materialId) {
    // Update the salesOrderId after the sequence has been generated
    doc.materialId = `${doc.store}${doc?.material_seq}`;
    doc.save().then(() => next());
  } else {
    next();
  }
});

//Export the model
export const Material = mongoose.model("Material", materialSchema);
