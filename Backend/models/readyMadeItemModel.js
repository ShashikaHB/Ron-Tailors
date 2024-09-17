import mongoose from "mongoose";

import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const readyMadeItemSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  salesPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sales Person is required."],
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
  readyMadeOrderId: {
    type: String,
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
  store: {
    enum: ["RW", "KE"],
    type: String,
    required: [true, "Store Location is required."],
  },
});

readyMadeItemSchema.plugin(AutoIncrement, {
    inc_field: "readyMadeOrderSeq",
    id: "readyMadeOrders",
    start_seq: 100,
  });
  
  readyMadeItemSchema.post("save", function (doc, next) {
    if (!doc.readyMadeOrderId) {
      // Update the readyMadeOrderId after the sequence has been generated
      doc.readyMadeOrderId = `${doc.store}${doc.readyMadeOrderSeq}`;
      doc.save().then(() => next());
    } else {
      next();
    }
  });

//Export the model
export const ReadyMadeItem = mongoose.model(
  "ReadyMadeItem",
  readyMadeItemSchema
);
