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
        rentItems: [
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
              itemCategory: {
                type: String,
                enum: ["General", "Full Suit", "National Suit", "Rent Full Suit"],
                default: "Rent Full Suit",
              },
              itemType: {
                type: String,
                enum: [
                  "Coat",
                  "National Coat",
                  "West Coat",
                  "Shirt",
                  "Trouser",
                  "Designed Trouser",
                  "Designed Shirt",
                  "National Shirt",
                  "Rent Coat",
                  "Rent West Coat",
                  "Sarong",
                  "Tie",
                  "Bow",
                  "Cravat",
                  "Hanky",
                  "Chain",
                ],
                required: [true, "Item Type is required."],
              },
              handLength: { type: String },
              notes: { type: String },
              amount: { type: Number },
            },
          ],
        amount: {
            type: Number,
            required: [true, "Amount is required."],
        }
      },
    ],
    fitOnRounds: [
      {
        fitOnNumber: {
            type: Number,
        },
        date: {
            type: Date,
            default: new Date()
        },
        isChecked: {
            type: Boolean,
            default: false
        }
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
