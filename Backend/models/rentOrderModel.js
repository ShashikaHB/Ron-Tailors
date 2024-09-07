import mongoose from "mongoose";

import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const rentOrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  rentOrderId: {
    type: String,
    unique: true,
  },
  store: {
    enum: ["RW", "KE"],
    type: String,
    required: [true, "Store Location is required."],
  },
  rentDate: {
    type: Date,
    required: [true, "Rent Date is required."],
  },
  returnDate: {
    type: Date,
    required: [true, "Return Date is required."],
  },
  salesPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rentOrderDetails: [
    {
      description: {
        type: String,
        required: [true, "Type is required"],
      },
      color: { type: String },
      size: { type: Number },
      rentItemId: {
        type: Number,
        required: [true, "Rent Item Id is required"],
      },
      type: {
        type: String,
        enum: ["Shirt", "Trouser", "Coat", "West Coat", "Cravat", "Bow", "Tie"],
        required: [true, "Item Type is required."],
      },
      handLength: { type: String },
      notes: { type: String },
      amount: { type: Number, required: [true, "Amount is required"] },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total is required."],
  },
  subTotal: {
    type: Number,
    required: [true, "Sub Total is required."],
  },
  discount: {
    type: Number,
  },
  advPayment: {
    type: Number,
  },
  balance: {
    type: Number,
  },
  paymentType: {
    type: String,
    enum: ["Cash", "Card"],
    required: [true, "Payment Type is required."],
  },
  stakeOption: {
    type: String,
    enum: ["NIC", "Deposit"],
    required: [true, "Payment Type is required."],
  },
  orderStatus: {
    type: String,
    enum: ["Completed", "AdvancePaid", "Incomplete"],
    default: "Incomplete",
  },
});

rentOrderSchema.plugin(AutoIncrement, {
  inc_field: "rentOrderSeq",
  id: "rentOrders",
  start_seq: 10,
});

rentOrderSchema.post("save", function (doc, next) {
  if (!doc.rentOrderId) {
    // Update the rentOrderId after the sequence has been generated
    doc.rentOrderId = `${doc.store}${doc.rentOrderSeq}`;
    doc.save().then(() => next());
  } else {
    next();
  }
});

//Export the model
export const RentOrder = mongoose.model("RentOrder", rentOrderSchema);
