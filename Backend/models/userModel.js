import mongoose from "mongoose";
import bcrypt from "bcrypt";

import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required"],
    unique: [true, "Mobile is already taken"],
    minLength: [10, "Mobile number should be 10 digits"],
    maxLength: [10, "Mobile number should be 10 digits"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    // minLength:[6, 'password length should be greater than 6 characters'],
  },
  role: {
    type: String,
    enum: ["Cutter", "Tailor", "Sales Person", "Admin", "Altering", "Ironing", "Cleaning"],
    default: "Sales Person",
  },
  salaryGrade: {
    type: String,
    enum: ["A", "B", "C"]
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  salary: {
    type: String,
  },
});

userSchema.plugin(AutoIncrement, {
  inc_field: "userId",
  id: "userIds",
  start_seq: 100,
});

userSchema.pre("save", async function (next) {
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// userSchema.methods.createPasswordResetToken = async function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
//   return resetToken;
// };

export const User = mongoose.model("User", userSchema);
