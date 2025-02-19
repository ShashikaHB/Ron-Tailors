import mongoose from "mongoose";

// Declare the Schema of the Materials
const materialSchema = new mongoose.Schema({
  materialId: { // material number
    type: String,
    require: [true, "Material Id is required"]
  },
  color: {
    type: String,
  },
  unitPrice: {
    type: Number,
  },
  unitCost: {
    type: Number,
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
  },
  name: {
    type: String,
  },
});

materialSchema.post("save", function (doc, next) {
  if (!doc.unitPrice) {
    // Update the salesOrderId after the sequence has been generated
    doc.unitPrice = doc.unitCost * 1.5;
    doc.save().then(() => next());
  } else {
    next();
  }
});

//Export the model
export const Material = mongoose.model("Material", materialSchema);
