import asyncHandler from "express-async-handler";
import { Transaction } from "../models/transactionModel.js";
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
  // Separate the transactions into credits and debits
  const credits = transactions.filter(
    (transaction) => transaction.type === "Credit"
  );
  const debits = transactions.filter(
    (transaction) => transaction.type === "Debit"
  );

  res.json({
    message: "All transactions fetched successfully.",
    success: true,
    data: {
      credits,
      debits,
    },
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
  const { type, amount, description } = req.body;

  if (!type || !amount || !description) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  const newTransaction = await Transaction.create({
    type,
    amount,
    description,
  });

  res.json({
    message: "Custom transaction added successfully.",
    success: true,
    data: newTransaction,
  });
});
