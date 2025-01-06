import mongoose from "mongoose";

import mongooseSequence from "mongoose-sequence";
import { ItemCategories, ItemTypes, OrderStatuses, PaymentTypes, RentItemStatuses, StakeOptions, StoreLocations, SuitTypes } from "../enums/common.js";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const rentOrderSchema = new mongoose.Schema({
  customer: {
    type: Number,
    required: [true, "Customer Id is required."]
},
  rentOrderId: {
    type: String,
    unique: true,
  },
  linkedSalesOrderId: {
    type: String,
  },
  store: {
    enum: StoreLocations,
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
    type: Number,
    required: [true, "Sales Person Id is required."]},
  suitType: {
    type: String,
    enum: SuitTypes,
    default:"Wedding"
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
        type: String,
        required: [true, "Rent Item Id is required"],
      },
      itemCategory: {
        type: String,
        enum: ItemCategories,
        default: "Rent Full Suit",
      },
      itemType: {
        type: String,
        enum: ItemTypes,
        required: [true, "Item Type is required."],
      },
      status: {
        type: String,
        enum: RentItemStatuses,
        default: "Available",
      },
      amount: {
        type: Number,
      },
      handLength: { type: String },
      notes: { type: String },
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
    enum: PaymentTypes,
    required: [true, "Payment Type is required."],
  },
  stakeOption: {
    type: String,
    enum: StakeOptions,
  },
  stakeAmount: {
    type: Number,
  },
  nicNumber: {
    type: String,
  },
  orderStatus: {
    type: String,
    enum: OrderStatuses,
    default: "Pending",
  },
  isNewRentOut: {
    type: Boolean,
    default: false
  },
},{
    timestamps: true, // Enable timestamps
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        delete ret.rentOrderSeq;
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
        delete ret.rentOrderSeq;
        return ret;
      },
    },
  });

// Add a unique auto-incremented sequence per store
rentOrderSchema.plugin(AutoIncrement, {
    inc_field: "rentOrderSeq",
    id: (doc) => `rentOrder_${doc.store}_counter`, // Unique counter per store
    reference_fields: ["store"],
    start_seq: 100,
  });
  
  rentOrderSchema.post("save", function (doc, next) {
    if (!doc.rentOrderId) {
      // Set the rentOrderId with store prefix and sequence
      doc.rentOrderId = `${doc.store}${doc.rentOrderSeq}-R`;
      doc.save().then(() => next());
    } else {
      next();
    }
  });

//Export the model
export const RentOrder = mongoose.model("RentOrder", rentOrderSchema);
