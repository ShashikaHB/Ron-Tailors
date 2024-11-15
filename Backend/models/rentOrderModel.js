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
  linkedSalesOrderId: {
    type: String,
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
  suitType: {
    type: String,
    enum: ["Wedding", "Normal"],
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
      status: {
        type: String,
        enum: ["Rented", "Available"],
        default: "Available",
      },
      handLength: { type: String },
      notes: { type: String },
      amount: { type: Number },
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
    enum: ["Cash", "Card", "Bank Transfer"],
    required: [true, "Payment Type is required."],
  },
  stakeOption: {
    type: String,
    enum: ["NIC", "Deposit", "No"],
  },
  stakeAmount: {
    type: Number,
  },
  nicNumber: {
    type: String,
  },
  orderStatus: {
    type: String,
    enum: ["Completed", "Advanced", "Incomplete"],
    default: "Incomplete",
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
