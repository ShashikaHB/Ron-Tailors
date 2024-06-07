import mongoose from "mongoose";

const depositSchema = new mongoose.Schema({
  depositType: {
    type: String,
    enum: ["NIC", "Cash"],
    required: true,
  },
  amount: {
    type: Number, // Store NIC as a string or amount of cash
  },
});

// Declare the Schema of the Mongo model
const rentOutSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    salesPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalPrice: {
      type: Number,
      required: [true, "Rent price is required."],
    },
    rentDate: {
      type: Date,
      required: [true, "Total price is required."],
    },
    returnDate: {
      type: Number,
      required: [true, "Total price is required."],
    },
    rentItemDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required."],
      },
    ],
    notes: {
      type: String,
    },
    discounts: {
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
    securityDeposit: depositSchema,
  },
  { timestamps: true }
);
//Export the model
export const RentOut = mongoose.model("RentOut", rentOutSchema);
