import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required."],
      unique: [true, "Mobile number already exists."],
    },
  },
  { timestamps: true }
);
//Export the model
export const Customer = mongoose.model("Customer", customerSchema);
