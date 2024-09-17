import asyncHandler from "express-async-handler";
import { PiecePrices } from "../models/piecePriceModel.js";

// @desc    Update or create piece prices for item types
// @route   POST /api/piecePrices
// @access  Public
export const updatePiecePrices = asyncHandler(async (req, res) => {
  const { items } = req.body; // array of {itemType, cuttingPrice, tailoringPrice}

  for (const item of items) {
    const { itemType, cuttingPrice, tailoringPrice } = item;

    // Use findOneAndUpdate with upsert to update or create if it doesn't exist
    await PiecePrices.findOneAndUpdate(
      { itemType }, // Find the document by itemType
      { cuttingPrice, tailoringPrice }, // Update the prices
      { upsert: true, new: true } // If not found, create a new one
    );
  }

  res.json({
    success: true,
    message: "Piece Prices updated successfully!",
  });
});

// @desc    Create or edit piece prices (bulk operation)
// @route   POST /api/piecePrices/bulk
// @access  Public
export const createEditPiecePrices = asyncHandler(async (req, res) => {
  const piecePrices = req.body; // array of {itemType, cuttingPrice, tailoringPrice}

  const bulkOperations = piecePrices.map((item) => ({
    updateOne: {
      filter: { itemType: item.itemType }, // Match by itemType
      update: { $set: { cuttingPrice: item.cuttingPrice, tailoringPrice: item.tailoringPrice } },
      upsert: true, // Insert a new document if no match is found
    },
  }));

  // Perform the bulkWrite operation
  await PiecePrices.bulkWrite(bulkOperations);

  res.status(201).json({
    message: "Piece prices created/updated successfully.",
    success: true,
  });
});

// @desc    Get all piece prices
// @route   GET /api/piecePrices
// @access  Public
export const getAllPiecePrices = asyncHandler(async (req, res) => {
  const piecePrices = await PiecePrices.find().select("-__v -_id").lean(); // Fetch all prices

  if (!piecePrices || piecePrices.length === 0) {
    return res.status(404).json({ success: false, message: "No piece prices found!" });
  }

  res.status(200).json({
    message: "Piece Prices fetched successfully.",
    success: true,
    data: piecePrices,
  });
});
