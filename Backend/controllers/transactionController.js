import asyncHandler from "express-async-handler";
import { Transaction } from "../models/transactionModel.js";
import { getDocId } from '../utils/docIds.js';
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

export const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find().lean().exec();

  if (!transactions) {
    throw new Error("No transactions found!");
  }

  res.json({
    message: "All transactions fetched successfully.",
    success: true,
    data: transactions
  });
});

// @desc    Get transactions by time period (today, monthly, annual)
// @route   GET /api/transactions
// @access  Public
export const getTransactionsByTimePeriod = asyncHandler(async (req, res) => {
  const { timePeriod } = req.query;

  let startDate, endDate;

  switch (timePeriod) {
    case "today":
      startDate = startOfDay(new Date());
      endDate = endOfDay(new Date());
      break;
    case "monthly":
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      break;
    case "annual":
      startDate = startOfYear(new Date());
      endDate = endOfYear(new Date());
      break;
    default:
      res.status(400);
      throw new Error("Invalid time period specified.");
  }

  const credits = await Transaction.find({
    type: "Credit",
    createdAt: { $gte: startDate, $lte: endDate },
  })
    .lean()
    .exec();

  const debits = await Transaction.find({
    type: "Debit",
    createdAt: { $gte: startDate, $lte: endDate },
  })
    .lean()
    .exec();

  res.json({
    message: `${
      timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)
    } transactions fetched successfully.`,
    success: true,
    data: {
      credits,
      debits,
    },
  });
});

export const addCustomTransaction = asyncHandler(async (req, res) => {
  const { transactionType, amount, description, paymentType, salesPerson, transactionCategory } = req.body;

  if (!transactionType || !amount || !description || !paymentType || !salesPerson || !transactionCategory) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  const newTransaction = await Transaction.create(req.body);

  if (!newTransaction) {
    throw new Error ('Internal server error')
  }

  res.json({
    message: `${transactionType} added successfully.`,
    success: true,
    data: newTransaction,
  });
});

export const getSingleCustomTransaction = asyncHandler(async (req, res) => {
    const { transactionId } = req.params; // Get the transaction ID from URL parameters

    if (!transactionId) {
        res.status(400);
        throw new Error("Transaction ID is required.");
      }  

    const transaction = await Transaction.findOne({transactionId}).lean().exec();
  
    if (!transaction) {
      throw new Error("No transaction found!");
    }
  
    res.json({
      message: "Transaction fetched successfully.",
      success: true,
      data: transaction
    });
  });

export const editCustomTransaction = asyncHandler(async (req, res) => {
    const { transactionId } = req.params; // Get the transaction ID from URL parameters
    const { transactionType, amount, description, paymentType, salesPerson, transactionCategory } = req.body;
  
    // Check if transactionId exists
    if (!transactionId) {
      res.status(400);
      throw new Error("Transaction ID is required.");
    }
  
    // Check if at least one field to update is provided
    if (!transactionType && !amount && !description && !paymentType && !salesPerson && !transactionCategory) {
      res.status(400);
      throw new Error("At least one field to update is required.");
    }

    const docId = await getDocId(Transaction, 'transactionId', transactionId )
  
    // Find the transaction by ID and update with the provided fields
    const updatedTransaction = await Transaction.findByIdAndUpdate(
        docId,
      {
        $set: req.body, // Update only the fields sent in the body
      },
      { new: true, runValidators: true } // Options: return the new document and run validations
    );
  
    // Check if the transaction was found and updated
    if (!updatedTransaction) {
      res.status(404);
      throw new Error("Transaction not found.");
    }
  
    // Return the updated transaction
    res.json({
      message: "Transaction updated successfully.",
      success: true,
      data: updatedTransaction,
    });
  });

  export const deleteCustomTransaction = asyncHandler(async (req, res) => {
    const { transactionId } = req.params; // Get the transaction ID from URL parameters
  
    // Check if transactionId exists
    if (!transactionId) {
      res.status(400);
      throw new Error("Transaction ID is required.");
    }

    const docId = await getDocId(Transaction, 'transactionId', transactionId )

  
    // Find the transaction by ID and delete it
    const deletedTransaction = await Transaction.findByIdAndDelete(docId);
  
    // Check if the transaction was found and deleted
    if (!deletedTransaction) {
      res.status(404);
      throw new Error("Transaction not found.");
    }
  
    // Return success message after deletion
    res.json({
      message: "Transaction deleted successfully.",
      success: true,
    });
  });