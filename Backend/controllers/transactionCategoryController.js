import asyncHandler from "express-async-handler";
import { TransactionCategory } from "../models/transactionCategoryModel.js";
import { getDocId } from '../utils/docIds.js';

// @desc    Get all transaction categories
// @route   GET /api/transactionCategories
// @access  Public
export const getAllTransactionCategories = asyncHandler(async (req, res) => {
  const transactionCategories = await TransactionCategory.find().lean().exec();

  if (!transactionCategories) {
    throw new Error("No transaction categories found!");
  }

  res.json({
    message: "All transaction categories fetched successfully.",
    success: true,
    data: transactionCategories
  });
});

// @desc    Add a new transaction category
// @route   POST /api/transactionCategories
// @access  Public
export const addTransactionCategory = asyncHandler(async (req, res) => {
  const { transactionType, transactionCategory } = req.body;

  // Validate required fields
  if (!transactionType || !transactionCategory) {
    res.status(400);
    throw new Error("Transaction type and category are required.");
  }

  const isExistingCategory = await TransactionCategory.findOne({transactionCategory})

  if (isExistingCategory) {
    throw new Error (`${transactionCategory} already Exists`)
  }

  // Create a new transaction category
  const newCategory = await TransactionCategory.create(req.body);

  if (!newCategory) {
    throw new Error("Internal server error");
  }

  res.json({
    message: `${transactionCategory} added successfully.`,
    success: true,
    data: newCategory,
  });
});

// @desc    Get a single transaction category by ID
// @route   GET /api/transactionCategories/:transactionCategory
// @access  Public
export const getSingleTransactionCategory = asyncHandler(async (req, res) => {
  const { transactionCategory } = req.params;

  if (!transactionCategory) {
    res.status(400);
    throw new Error("transactionCategory is required.");
  }

  const category = await TransactionCategory.findOne({transactionCategory}).lean().exec();

  if (!category) {
    res.status(404);
    throw new Error("Transaction category not found.");
  }

  res.json({
    message: "Transaction category fetched successfully.",
    success: true,
    data: category,
  });
});

// @desc    Edit a transaction category by ID
// @route   PUT /api/transactionCategories/:transactionCategory
// @access  Public
export const editTransactionCategory = asyncHandler(async (req, res) => {
  const { transactionType, transactionCategory } = req.body;

  if (!transactionCategory) {
    res.status(400);
    throw new Error("transactionCategory is required.");
  }

  // Ensure at least one field to update is provided
  if (!transactionType || !transactionCategory) {
    res.status(400);
    throw new Error("At least one field to update is required.");
  }

  const docId = await getDocId(TransactionCategory, 'transactionCategory', transactionCategory);

  const updatedCategory = await TransactionCategory.findByIdAndUpdate(
    docId,
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    res.status(404);
    throw new Error("Transaction category not found.");
  }

  res.json({
    message: "Transaction category updated successfully.",
    success: true,
    data: updatedCategory,
  });
});

// @desc    Delete a transaction category by ID
// @route   DELETE /api/transactionCategories/:transactionCategory
// @access  Public
export const deleteTransactionCategory = asyncHandler(async (req, res) => {
  const { transactionCategory } = req.params;

  if (!transactionCategory) {
    res.status(400);
    throw new Error("Category ID is required.");
  }

  const docId = await getDocId(TransactionCategory, 'transactionCategory', transactionCategory);

  const deletedCategory = await TransactionCategory.findByIdAndDelete(docId);

  if (!deletedCategory) {
    res.status(404);
    throw new Error("Transaction category not found.");
  }

  res.json({
    message: "Transaction category deleted successfully.",
    success: true,
  });
});