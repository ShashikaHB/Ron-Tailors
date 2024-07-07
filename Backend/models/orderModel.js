import mongoose from "mongoose";

import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    orderDate: {
      type: Date,
      required: [true, "Order Date is required."],
    },
    deliveryDate: {
      type: Date,
      required: [true, "Delivery Date is required."],
    },
    weddingDate: {
      type: Date,
    },
    salesPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderDetails: [
      {
        type: {
          type: String,
          required: [true, "Type is required"],
        },
        products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        ],
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
      required: [true, "Item Type is required."],
    },
  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, {
  inc_field: "orderId",
  id: "orders",
  start_seq: 10,
});

//Export the model
export const Order = mongoose.model("Order", orderSchema);
