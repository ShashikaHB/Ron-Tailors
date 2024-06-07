import asyncHandler from "express-async-handler";
import { Product } from "../models/productModel.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
export const createProduct = asyncHandler(async (req, res) => {
  const {
    color,
    materials,
    style,
    type,
    measurements,
    cost,
    price,
    noOfUnits,
    status,
    fitOnRounds,
    cutter,
    tailor,
    measurer,
    rentPrice,
  } = req.body;

  const newProduct = await Product.create({
    color,
    materials,
    style,
    type,
    measurements,
    cost,
    price,
    noOfUnits,
    status,
    fitOnRounds,
    cutter,
    tailor,
    measurer,
    rentPrice,
  });

  res.json({
    message: "New product created Successfully.",
    success: true,
    data: newProduct,
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json({
    message: "All Products Fetched Successfully.",
    success: true,
    data: products,
  });
});
