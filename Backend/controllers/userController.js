import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -_id -__v -createdAt -updatedAt -refreshToken")
      .lean()
      .exec();

    if (!users) {
      return res.status(404).json({
        message: "No users found.",
        success: false,
      });
    }
    res
      .status(200)
      .json({ message: "All users fetched.", success: true, data: users });
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("User id is required.");
  }

  const user = await User.findOne({ userId: id })
    .select("-password -_id -__v -refreshToken")
    .lean();
  if (!user) {
    res.status(404);
    throw new Error("User not Found!");
  }
  res.json({
    message: "Users fetched.",
    success: true,
    user,
  });
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
      salaryGrade: req?.body?.salaryGrade,
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

// @desc    Update user's salary grade
// @route   PUT /api/users/:userId/salaryGrade
// @access  Private/Admin
export const updateSalaryGrade = asyncHandler(async (req, res) => {
    const { userId } = req.params;  // Extract the userId from request parameters
    const { salaryGrade } = req.body;  // Extract the salaryGrade from the request body
  
    // Find the user by userId
    const user = await User.findOne({ userId });
  
    if (!user) {
      res.status(404);
      throw new Error('User not found.');
    }
  
    // Update user's salaryGrade
    user.salaryGrade = salaryGrade;
  
    // Save the updated user details
    const updatedUser = await user.save();
  
    // Send response
    res.json({
      message: "User's salary grade updated successfully.",
      success: true,
      data: updatedUser,
    });
  });
