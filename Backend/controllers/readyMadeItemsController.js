import { ReadyMadeItem } from "../models/readyMadeItemModel.js";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { Customer } from "../models/customerModel.js";
import { Transaction } from "../models/transactionModel.js";
import { sendSMS } from '../notificationSMS/smsNotification.js';

export const createReadyMadeItemOrder = asyncHandler(async (req, res) => {
  const {
    salesPerson,
    customer: { name, mobile },
    itemType,
    paymentType,
  } = req.body;
  const salesPersonDoc = await User.findOne({ userId: salesPerson })
    .lean()
    .exec();
  if (!salesPersonDoc) {
    res.status(404);
    throw new Error(`No user found for ID ${salesPerson}`);
  }

  let customer = undefined;
  customer = await Customer.findOne({ mobile }).lean().exec();
  if (!customer) {
    customer = await Customer.create({ name, mobile });
  }

  const newReadyMadeItem = await ReadyMadeItem.create({
    ...req.body,
    customer: customer._id,
    salesPerson: salesPersonDoc._id,
  });

  // Create a credit transaction
  const newTransaction = await Transaction.create({
    transactionType: "Income",
    transactionCategory: "Ready Made Order",
    paymentType: paymentType,
    salesPerson: salesPersonDoc.name,
    store: req.body?.store,
    amount: newReadyMadeItem.price,
    description: `Rent Order: ${newReadyMadeItem.readyMadeOrderId}`,
  });

  const messageBody = `Hi ${name}. Thank you for your purchase of ${itemType}`;
    await sendSMS(messageBody, mobile);

  res.json({
    message: "New ReadyMade item created",
    success: true,
    data: newReadyMadeItem,
  });
});

export const getAllReadyMadeItems = asyncHandler(async (req, res) => {
  try {
    const getAllReadyMadeItems = await ReadyMadeItem.find();
    res.json({
      message: "All ready made items fetched.",
      success: true,
      data: getAllReadyMadeItems,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleReadyMadeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getReadyMadeItem = await ReadyMadeItem.findById(id);
    res.json({
      message: "Ready made item fetched.",
      success: true,
      data: getReadyMadeItem,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateReadyMadeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMaterial = await ReadyMadeItem.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        color: req?.body?.color,
        unitPrice: req?.body?.unitPrice,
        noOfUnits: req?.body?.noOfUnits,
        cost: req?.body?.cost,
        type: req?.body?.type,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "Ready Made Item updated.",
      success: true,
      data: updatedMaterial,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteReadyMadeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleteReadyMadeItem = await ReadyMadeItem.findByIdAndDelete(id);
    res.json({
      message: "Ready Made Item Deleted Successfully.",
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});
