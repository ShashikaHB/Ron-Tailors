import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

// Declare the Schema of the Mongo model
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required."],
    unique: [true, "Mobile number already exists."],
  },
  secondaryMobile: {
    type: String,
  },
  otherMobile: {
    type: String,
  }
});

customerSchema.plugin(AutoIncrement, {
  inc_field: "customerId",
  id: "customers",
  start_seq: 100,
});

//Export the model
export const Customer = mongoose.model("Customer", customerSchema);
