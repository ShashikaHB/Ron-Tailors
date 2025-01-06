import mongoose from "mongoose";

import mongooseSequence from "mongoose-sequence";
import {
  ItemCategories,
  ItemTypes,
  OrderStatuses,
  PaymentTypes,
  StoreLocations,
} from "../enums/common.js";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const salesOrderSchema = new mongoose.Schema(
  {
    salesOrderId: {
      type: String,
      unique: true,
    },
    customer: {
      type: Number,
      required: [true, "Customer Id is required."],
    },
    store: {
      enum: StoreLocations,
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
      type: Number,
      required: [true, "Sales Person Id is required."],
    },
    orderDetails: [
      {
        description: {
          type: String,
        },
        category: {
          type: String,
          enum: ItemCategories,
        },
        products: [
          {
            type: Number,
          },
        ],
        rentItems: [
          {
            description: {
              type: String,
            },
            color: { type: String },
            size: { type: Number },
            rentItemId: {
              type: String,
            },
            itemCategory: {
              type: String,
              enum: ItemCategories,
              default: "Rent Full Suit",
            },
            itemType: {
              type: String,
              enum: ItemTypes,
            },
            handLength: { type: String },
            notes: { type: String },
          },
        ],
        amount: {
          type: Number,
        },
      },
    ],
    fitOnRounds: [
      {
        fitOnNumber: {
          type: Number,
        },
        date: {
          type: Date,
          default: new Date(),
        },
        isChecked: {
          type: Boolean,
          default: false,
        },
      },
    ],
    linkedRentOrder: {
      type: String,
    },
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
      enum: PaymentTypes,
      required: [true, "Payment Type is required."],
    },
    orderStatus: {
      type: String,
      enum: OrderStatuses,
      default: "Pending",
    },
  },
  {
    timestamps: true, // Enable timestamps
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        delete ret.salesOrderSeq;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        delete ret.salesOrderSeq;
        return ret;
      },
    },
  }
);

// Add a unique auto-incremented sequence per store
salesOrderSchema.plugin(AutoIncrement, {
  inc_field: "salesOrderSeq",
  id: (doc) => `salesOrder_${doc.store}_counter`, // Unique counter per store
  reference_fields: ["store"],
  start_seq: 1000,
});

salesOrderSchema.post("save", function (doc, next) {
  if (!doc.salesOrderId) {
    // Set the salesOrderId with store prefix and sequence
    doc.salesOrderId = `${doc.store}${doc.salesOrderSeq}`;
    doc.save().then(() => next());
  } else {
    next();
  }
});

//Export the model
export const SalesOrder = mongoose.model("SaleOrder", salesOrderSchema);
