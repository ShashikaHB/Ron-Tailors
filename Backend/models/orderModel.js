import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    orderDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    salesPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required."],
    },
    discount: {
      type: Number,
    },
    advPayment: {
      type: Number,
    },
    paymentType: {
      type: String,
      enum: ["Cash", "Card"],
      required: [true, "Item Type is required."],
    },
    isNewRentOut: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
//Export the model
export const Order = mongoose.model("Order", orderSchema);
