import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
import { ItemCategories, ItemTypes } from "../enums/common.js";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    materials: [
      {
        material: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Material",
        },
        unitsNeeded: {
          type: Number,
        },
      },
    ],
    color: {
      type: String,
    },
    itemCategory: {
      type: String,
      enum: ItemCategories,
      default: "General",
    },
    itemType: {
      type: String,
      enum: ItemTypes,
      required: [true, "Item Type is required."],
    },
    measurement: { type: mongoose.Schema.Types.ObjectId, ref: "Measurements" },
    size: {
      type: Number,
    },
    price: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "Not Started",
        "Cutting Done",
        "Tailoring Started",
        "Tailoring Done",
      ],
      required: [true, "Status is required."],
      default: "Not Started",
    },
    cutter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    measurer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rentPrice: {
      type: Number,
    },
    isNewRentOut: {
      type: Boolean,
      default: false,
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
        return ret;
      },
    },
  }
);

productSchema.index({ productId: 1 }, { unique: true }); // Ensure productId is unique

productSchema.plugin(AutoIncrement, {
  inc_field: "productId",
  id: "products",
  start_seq: 100,
});
//Export the model
export const Product = mongoose.model("Product", productSchema);
