import {
  generateAccessToken,
  verifyRefreshToken,
  generateRefreshToken,
} from "../utils/jwtToken.js";
import * as dotenv from "dotenv";
import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

dotenv.config();

export const registerUser = asyncHandler(async (req, res) => {
  const { name, password, mobile } = req.body;

  if (!mobile || !name || !password) {
    throw new Error("Mobile number, name and password is required.");
  }

  const duplicates = await User.findOne({ mobile }).lean().exec();

  if (!duplicates) {
    const newUser = await User.create(req.body);
    if (newUser) {
      const userObject = newUser.toObject();

      // Filter out the fields which needs to be send to the frontend.
      const {
        _id,
        __v,
        createdAt,
        updatedAt,
        password,
        refreshToken,
        ...filteredUser
      } = userObject;

      const newRefreshToken = generateRefreshToken(newUser?.userId);

      const updateUser = await User.findByIdAndUpdate(
        newUser._id, // MongoDb Object Id should be used when using findById and Update
        {
          refreshToken: newRefreshToken, // Save refresh token
        },
        { new: true }
      );

      if (!updateUser) {
        throw new Error("Update user failed to save refresh token.");
      }

      // Refresh token should be stored in http only cookie as it does not have js access which is secure.
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true, // Served only on http. Therefore, secured.
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({
        message: "User registration successful.",
        success: true,
        user: filteredUser,
        accessToken: generateAccessToken(newUser?.userId),
      });
    } else {
      throw new Error("Invalid Credentials");
    }

    res.status(200).json({
      message: `New user created for ${newUser.name} - ${newUser.mobile} ${newUser.userId}`,
      success: true,
      user: filteredUser,
      accessToken: generateAccessToken(newUser?.userId),
    });
  } else {
    throw new Error(`Mobile number already exists for ${duplicates.name}.`);
  }
});

export const login = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;

  // Check if user exists or not
  const user = await User.findOne({ mobile }).exec();

  if (!user) {
    res.status(404);
    throw new Error("No user found for mobile number " + mobile);
  }

  if (user && (await user.isPasswordMatched(password))) {
    const userObject = user.toObject();

    // Filter out the fields which needs to be send to the frontend.
    const {
      _id,
      __v,
      createdAt,
      updatedAt,
      password,
      refreshToken,
      ...filteredUser
    } = userObject;

    const newRefreshToken = generateRefreshToken(user?.userId);

    const updateUser = await User.findByIdAndUpdate(
      user._id, // MongoDb Object Id should be used when using findById and Update
      {
        refreshToken: newRefreshToken, // Save refresh token
      },
      { new: true }
    );

    if (!updateUser) {
      throw new Error("Update user failed to save refresh token.");
    }

    // Refresh token should be stored in http only cookie as it does not have js access which is secure.
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true, // Served only on http. Therefore, secured.
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "User login successful.",
      success: true,
      user: filteredUser,
      accessToken: generateAccessToken(user?.userId),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

export const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    throw new Error("No refresh token found!");
  }

  // Extract refreshToken from cookies

  const extractedRefreshToken = cookies.refreshToken;

  const user = await User.findOne({ refreshToken: extractedRefreshToken })
    .lean()
    .exec();

  if (!user) {
    throw new Error("No user with provided refresh token");
  }

  try {
    const { userId } = await verifyRefreshToken(extractedRefreshToken);

    // Check if the token is been tampered with
    if (user.userId !== userId) {
      throw new Error("Invalid Token");
    }
    // Generate new Access Token
    const newAccessToken = generateAccessToken(user.userId);

    const {
      _id,
      __v,
      createdAt,
      updatedAt,
      password,
      refreshToken,
      ...filteredUser
    } = user;

    res.json({
      message: "User login refreshed.",
      success: true,
      user: filteredUser,
      accessToken: newAccessToken,
    });
  } catch (error) {
    throw new Error(`${error}`);
  }
});

export const handleLogOut = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    throw new Error("No refresh token found!");
  }

  // Extract refreshToken from cookies

  const extractedRefreshToken = cookies.refreshToken;

  const user = await User.findOne({ refreshToken: extractedRefreshToken })
    .lean()
    .exec();

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
    });
    res.json({
      message: "User logout successful.",
      success: true,
    });
  }

  const updateUser = await User.findByIdAndUpdate(
    user._id, // MongoDb Object Id should be used when using findById and Update
    {
      refreshToken: "", // Save refresh token
    },
    { new: true }
  );

  if (!updateUser) {
    throw new Error("Update user failed to save refresh token.");
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
  });
  res.json({
    message: "User logout successful.",
    success: true,
  });
});