import asyncHandler from "express-async-handler";
import { PiecePrices } from "../models/piecePriceModel.js";

// @desc    Create piece prices
// @route   POST /api/piecePrices
// @access  Public
export const createEditPiecePrices = asyncHandler(async (req, res) => {
  const piecePrices = req.body; // array of {category, items}

  for (const { category, items } of piecePrices) {
    // Find existing piece prices by category
    const existingPiece = await PiecePrices.findOne({ category });

    if (!existingPiece) {
      // Create a new piece entry if it doesn't exist
      const newPiece = await PiecePrices.create({ category, items });

      if (!newPiece) {
        throw new Error(
          `Failed to create piece prices for category: ${category}`
        );
      }
    } else {
      // Update the existing piece's items
      existingPiece.items = items;
      await existingPiece.save();
    }
  }

  // Send a response for all processed categories
  res.status(201).json({
    message: `Piece prices created/updated successfully.`,
    success: true,
  });
});

export const getAllPiecePrices = asyncHandler(async(req,res)=> {

    const piecePrices = await PiecePrices.find().select("-__v -_id").lean()

    if (!piecePrices) {
        throw new Error('No piece prices found!')
    }

    res.status(201).json({
        message: `Piece Prices fetched Successfully`,
        success: true,
        data: piecePrices
    })
})
