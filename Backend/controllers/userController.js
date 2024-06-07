import { generateToken } from "../config/jwtToken.js";
import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const createUser = asyncHandler(async (req, res) => {
  const mobile = req.body.mobile;

  const userExists = await User.findOne({ mobile });

  if (!userExists) {
    const newUser = await User.create(req.body);
    res.json({
      message: "New user created",
      success: true,
      data: newUser,
    });
  } else {
    throw new Error("User already exists.");
  }
});

export const login = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;
  // check if user exists or not
  const userExists = await User.findOne({ mobile });
  if (userExists && (await userExists.isPasswordMatched(password))) {
    // const refreshToken = await generateRefreshToken(userExists?._id);
    // const updateuser = await User.findByIdAndUpdate(
    //   userExists.id,
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   { new: true }
    // );
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 72 * 60 * 60 * 1000,
    // });
    res.json({
      _id: userExists?._id,
      name: userExists?.name,
      role: userExists?.role,
      mobile: userExists?.mobile,
      token: generateToken(userExists?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json({ message: "All users fetched.", success: true, data: getUsers });
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getUser = await User.findById(id);
    res.json({
      message: "Users fetched.",
      success: true,
      data: getUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        mobile: req?.body?.mobile,
        role: req?.body?.role,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "Users updated.",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      message: "Users Deleted Successfully.",
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});
