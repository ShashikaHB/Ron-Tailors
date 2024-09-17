import mongoose from "mongoose";

import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const salesOrderSchema = new mongoose.Schema(
  {
    salesOrderId: {
        type: String,
        unique: true,
      },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    store: {
      enum: ["RW", "KE"],
      type: String,
      required: [true, "Store Location is required."],
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
        description: {
          type: String,
        },
        category: {
            type: String,
          },
        products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        ],
      },
    ],
    fitOnRounds: [
      {
        type: Date,
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
      enum: ["Cash", "Card", "Bank Transfer"],
      required: [true, "Payment Type is required."],
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending"
    },
  },
  { timestamps: true }
);

salesOrderSchema.plugin(AutoIncrement, {
  inc_field: "salesOrderSeq",
  id: "salesOrders",
  start_seq: 1000,
});

salesOrderSchema.post("save", function (doc, next) {
  if (!doc.salesOrderId) {
    // Update the salesOrderId after the sequence has been generated
    doc.salesOrderId = `${doc.store}${doc?.salesOrderSeq}`;
    doc.save().then(() => next());
  } else {
    next();
  }
});

//Export the model
export const SalesOrder = mongoose.model("SaleOrder", salesOrderSchema);
