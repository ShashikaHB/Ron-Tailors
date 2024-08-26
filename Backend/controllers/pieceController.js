import asyncHandler from "express-async-handler";
import { PiecePrices } from "../models/piecePriceModel.js";

// @desc    Create piece prices
// @route   POST /api/piecePrices
// @access  Public
export const createPiecePrices = asyncHandler(async (req, res) => {
  const { type, ...prices } = req.body;

  if (!type || !['Cutting', 'Tailoring'].includes(type)) {
    res.status(400);
    throw new Error("Valid type ('Cutting' or 'Tailoring') is required.");
  }

  const existingPiecePrices = await PiecePrices.findOne({ type });

  if (existingPiecePrices) {
    res.status(400);
    throw new Error(`Piece prices for ${type} already exist. Use update instead.`);
  }

  const piecePrices = new PiecePrices({ type, ...prices });
  await piecePrices.save();

  res.status(201).json({
    message: `Piece prices for ${type} created successfully.`,
    success: true,
    data: piecePrices,
  });
});

// @desc    Update piece prices
// @route   PATCH /api/piecePrices/:type
// @access  Public
export const updatePiecePrices = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { ...prices } = req.body;

  if (!type || !['Cutting', 'Tailoring'].includes(type)) {
    res.status(400);
    throw new Error("Valid type ('Cutting' or 'Tailoring') is required.");
  }

  let piecePrices = await PiecePrices.findOne({ type });

  if (!piecePrices) {
    res.status(404);
    throw new Error(`Piece prices for ${type} not found. Use create instead.`);
  }

  Object.assign(piecePrices, prices);
  await piecePrices.save();

  res.status(200).json({
    message: `Piece prices for ${type} updated successfully.`,
    success: true,
    data: piecePrices,
  });
});

// @desc    Get piece prices by type
// @route   GET /api/piecePrices/:type
// @access  Public
export const getPiecePricesByType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  if (!['Cutting', 'Tailoring'].includes(type)) {
    res.status(400);
    throw new Error("Valid type ('Cutting' or 'Tailoring') is required.");
  }

  const piecePrices = await PiecePrices.findOne({ type }).lean();

  if (!piecePrices) {
    res.status(404);
    throw new Error("Piece prices not found.");
  }

  res.json({
    message: "Piece prices fetched successfully.",
    success: true,
    data: piecePrices,
  });
});

// @desc    Delete piece prices by type
// @route   DELETE /api/piecePrices/:type
// @access  Public
export const deletePiecePricesByType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  if (!['Cutting', 'Tailoring'].includes(type)) {
    res.status(400);
    throw new Error("Valid type ('Cutting' or 'Tailoring') is required.");
  }

  const piecePrices = await PiecePrices.findOne({ type });

  if (!piecePrices) {
    res.status(404);
    throw new Error("Piece prices not found.");
  }

  await PiecePrices.deleteOne({ type });

  res.json({
    message: `Piece prices for ${type} deleted successfully.`,
    success: true,
  });
});
