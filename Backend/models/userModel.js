import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    mobile: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Email is already taken"],
      minLength: [10, "password length should be greater than 6 characters"],
      maxLength: [10, "password length should be greater than 6 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // minLength:[6, 'password length should be greater than 6 characters'],
    },
    role: {
      type: String,
      enum: ["Cutter", "Tailor", "Sales Person", "Admin"],
      required: [true, "Name is required"],
      // minLength:[6, 'password length should be greater than 6 characters'],
    },
    salary: {
      type: String,
      // minLength:[6, 'password length should be greater than 6 characters'],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
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
