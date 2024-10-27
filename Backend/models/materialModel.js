import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Materials
const materialSchema = new mongoose.Schema({
  materialId: {
    type: String,
    require: [true, "Material Id is required"]
  },
  color: {
    type: String,
  },
  unitPrice: {
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
});

materialSchema.plugin(AutoIncrement, {
  inc_field: "material_seq",
  id: "materials",
  start_seq: 100,
});

// materialSchema.post("save", function (doc, next) {
//   if (!doc.materialId) {
//     // Update the salesOrderId after the sequence has been generated
//     doc.materialId = `${doc.store}${doc?.material_seq}`;
//     doc.save().then(() => next());
//   } else {
//     next();
//   }
// });

//Export the model
export const Material = mongoose.model("Material", materialSchema);
