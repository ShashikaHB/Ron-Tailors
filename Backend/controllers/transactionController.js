import asyncHandler from "express-async-handler";
import { Transaction } from "../models/transactionModel.js";
import { getDocId } from "../utils/docIds.js";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { DailySummary } from "../models/dailySummaryModel.js";
import { updateDailySummary } from "../utils/updateDailySummary.js";
import { User } from "../models/userModel.js";
import { updateMonthlySummaryWithSalary } from "./monthlySummaryController.js";

export const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find().lean().exec();

  if (!transactions) {
    throw new Error("No transactions found!");
  }

  res.json({
    message: "All transactions fetched successfully.",
    success: true,
    data: transactions,
  });
});

export const getFilteredTransactions = asyncHandler(async (req, res) => {
  const { fromDate, toDate, store } = req.body;

  // Validate that fromDate and toDate are provided
  if (!fromDate || !toDate || !store) {
    return res.status(400).json({
      message: 'Both fromDate and toDate are required.',
      success: false,
    });
  }

  // Convert fromDate and toDate to JavaScript Date objects
  const from = new Date(fromDate);
  const to = new Date(toDate);

  let query = { store }; 

  // If fromDate and toDate are the same (ignoring the time part)
  if (from.toDateString() === to.toDateString()) {
    // Query for transactions that occurred on that specific day (between 00:00:00 and 23:59:59)
    query.date = {
      $gte: new Date(from.setHours(0, 0, 0, 0)),  // Start of the day (00:00:00)
      $lte: new Date(from.setHours(23, 59, 59, 999))  // End of the day (23:59:59)
    };
  } else {
    // Query for transactions within the range from fromDate to toDate
    query.date = {
      $gte: new Date(from.setHours(0, 0, 0, 0)), // Start of fromDate
      $lte: new Date(to.setHours(23, 59, 59, 999)) // End of toDate
    };
  }

  // Fetch filtered transactions based on the query
  const transactions = await Transaction.find(query).lean().exec();

  // If no transactions are found
  if (!transactions || transactions.length === 0) {
    return res.status(404).json({
      message: 'No transactions found for the specified date range.',
      success: false,
    });
  }

  const formattedTransactions = transactions.map(transaction => ({
    ...transaction,
    date: new Date(transaction.date).toISOString().split('T')[0] // Format to YYYY-MM-DD
  }));

  // Return the filtered transactions
  res.json({
    message: 'Transactions fetched successfully.',
    success: true,
    data: formattedTransactions,
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
  const {
    transactionType,
    amount,
    description,
    paymentType,
    store,
    salesPerson,
    transactionCategory,
    user,
    date
  } = req.body;

  if (
    !transactionType ||
    !amount ||
    !description ||
    !store ||
    !paymentType ||
    !salesPerson ||
    !transactionCategory
  ) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  const salesPersonDoc = await User.findOne({userId: salesPerson}).lean().exec()
  if (!salesPersonDoc) {
    res.status(404);
    throw new Error(`No user found for ID ${salesPerson}`);
  }

  const newTransaction = await Transaction.create({...req.body, salesPerson:salesPersonDoc?.name});

  await updateDailySummary(newTransaction);

  if (!newTransaction) {
    throw new Error("Internal server error");
  }

  if (transactionCategory === "Salary" || transactionCategory === "Salary Advance") {
    if (!user) {
        throw new Error("Employee details not provided!")
    }

  }

  const month = (new Date(date) || new Date)

  if (transactionCategory === "Salary" || transactionCategory === 'Salary Advance') {
      const addSalary = await updateMonthlySummaryWithSalary(user, month.toISOString().slice(0, 7), transactionCategory, amount );
      if (!addSalary) {
        throw new Error ("Salary updating failed!")
      }

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

  const transaction = await Transaction.findOne({ transactionId })
    .lean()
    .exec();

  if (!transaction) {
    throw new Error("No transaction found!");
  }

  res.json({
    message: "Transaction fetched successfully.",
    success: true,
    data: transaction,
  });
});

export const editCustomTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params; // Get the transaction ID from URL parameters
  const {
    transactionType,
    amount,
    description,
    paymentType,
    salesPerson,
    transactionCategory,
  } = req.body;

  // Check if transactionId exists
  if (!transactionId) {
    res.status(400);
    throw new Error("Transaction ID is required.");
  }

  // Check if at least one field to update is provided
  if (
    !transactionType &&
    !amount &&
    !description &&
    !paymentType &&
    !salesPerson &&
    !transactionCategory
  ) {
    res.status(400);
    throw new Error("At least one field to update is required.");
  }

  const docId = await getDocId(Transaction, "transactionId", transactionId);

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

  const docId = await getDocId(Transaction, "transactionId", transactionId);

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

// Controller to get a single day's summary
export const getDayEndRecord = asyncHandler(async (req, res) => {
    const { date, store } = req.body;
  
    // Validate that a date is provided
    if (!date || !store) {
      return res.status(400).json({
        message: 'Date is required.',
        success: false,
      });
    }
  
    // Convert date to ISO format without time (e.g., '2024-09-15')
    const transactionDate = new Date(date).toISOString().split('T')[0];
  
    // Find the daily summary for the given date
    const dailySummary = await DailySummary.findOne({
      date: transactionDate,
    }).lean().exec();
  
    // If no summary found for the date, return an error
    if (!dailySummary) {
      return res.status(404).json({
        message: `No summary found for the date ${transactionDate}.`,
        success: false,
      });
    }
  
    // Return the daily summary
    res.json({
      message: 'Daily summary fetched successfully.',
      success: true,
      data: dailySummary,
    });
  });

export const getAllDayEndRecords = asyncHandler(async (req, res) => {

    const {store} = req.params

    if (!store) {
        throw new Error ("Store is required!")
    }
  
    // Find the daily summary for the given date
    const dailySummary = await DailySummary.find({store}).lean();
  
    // If no summary found for the date, return an error
    if (!dailySummary) {
      return res.status(404).json({
        message: `No summary found`,
        success: false,
      });
    }

     // Format the 'date' field to return only the YYYY-MM-DD part (ISO format)
  const formattedDailySummary = dailySummary.map((summary) => ({
    ...summary,
    date: new Date(summary.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
  }));
  
    // Return the daily summary
    res.json({
      message: 'Daily summary fetched successfully.',
      success: true,
      data: formattedDailySummary,
    });
  });

export const updateCashInHand = asyncHandler(async (req, res) => {
  const { date, countedCash, store } = req.body;

  // Validate inputs
  if (!date || countedCash === undefined) {
    return res.status(400).json({
      message: "Date and countedCash are required.",
      success: false,
    });
  }

  // Convert date to ISO format without time (e.g., '2024-09-15')
  const transactionDate = new Date(date).toISOString().split("T")[0];

  // Find the daily summary for the given date
  let dailySummary = await DailySummary.findOne({
    date: transactionDate,
    store
  }).exec();

  // If no summary found for the date, return an error
  if (!dailySummary) {
    return res.status(404).json({
      message: `No summary found for the date ${transactionDate}.`,
      success: false,
    });
  }

  // Update counted cash
  dailySummary.countedCash = countedCash;

  // Calculate the difference between countedCash and countedCash
  dailySummary.difference = countedCash - dailySummary.countedCash;

  // Save the updated summary
  await dailySummary.save();

  // Return the updated summary
  res.json({
    message: "Cash in hand updated successfully.",
    success: true,
    data: dailySummary,
  });
});


