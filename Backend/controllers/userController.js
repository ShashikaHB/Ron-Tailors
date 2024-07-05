import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -_id -__v -createdAt -updatedAt -refreshToken")
      .lean();

    if (!users) {
      return res.status(404).json({
        message: "No users found.",
        success: false,
      });
    }

    res
      .status(200)
      .json({ message: "All users fetched.", success: true, users });
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("User id is required.");
  }

  try {
    const user = await User.findOne({ userId: id })
      .select("-password -_id -__v -refreshToken")
      .lean();
    res.json({
      message: "Users fetched.",
      success: true,
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("User id is required.");
  }

  const user = await User.findOne({ userId: id }).exec();

  if (req?.body?.password) {
    user.password = req?.body?.password;
  }
  // Handle save password here due to pre save hook in mongoose schema to convert password to hash string
  const saveNewPassword = await user.save();

  if (!user) {
    throw new Error("User does not exist.");
  }
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      name: req?.body?.name,
      mobile: req?.body?.mobile,
      role: req?.body?.role,
      isActive: req?.body?.isActive,
      salary: req?.body?.salary,
    },
    {
      new: true,
    }
  );

  // Save the user, triggering the pre-save hook
  await user.save();
  if (!updatedUser || (req?.body?.password && !saveNewPassword)) {
    throw new Error("User could not be updated.");
  }
  res.json({
    message: "Users updated.",
    success: true,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ userId: id }).select("_id").lean().exec();

  if (!user) {
    throw new Error("User does not exist.");
  }

  const deleteUser = await User.findByIdAndDelete(user._id);
  res.json({
    message: "Users Deleted Successfully.",
    success: true,
  });
});
