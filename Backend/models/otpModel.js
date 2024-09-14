import mongoose from "mongoose";

// Declare the Schema of the Mongo model
let otpSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: [true, "Mobile number is required."],
    unique: [true, "Mobile number already exists."],
  },
  otp: {
    type: String,
    required: [true, "OTP is required."],
  },
},{timestamps: true});

otpSchema.index({createdAt: 1},{expireAfterSeconds: 3600}); // Set expiration time to remove the saved OTP.


//Export the model
export const OTPModel = mongoose.model("otp", otpSchema);
