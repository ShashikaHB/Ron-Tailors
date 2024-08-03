import mongoose from "mongoose";

import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const rentOrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
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
        productId: { type: Number },
        color: { type: String },
        size: { type: Number },
        description: { type: String },
        handLength: { type: String },
        notes: { type: String },
        amount: { type: Number, required: [true, "Amount is required"] },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required."],
    },
    subTotal: {
      type: Number,
      required: [true, "Total price is required."],
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
    StakeOptions: {
      type: String,
      enum: ["NIC", "Deposit"],
    },
  },
  { timestamps: true }
);

rentOrderSchema.plugin(AutoIncrement, {
  inc_field: "rentOrderId",
  id: "rentOrders",
  start_seq: 10,
});

//Export the model
export const SalesOrder = mongoose.model("RentOrder", rentOrderSchema);
