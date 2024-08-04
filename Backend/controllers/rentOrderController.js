import asyncHandler from "express-async-handler";
import { Customer } from "../models/customerModel.js";
import { User } from "../models/userModel.js";
import {
  getAutoGeneratedId,
  getDocId,
  getProductFields,
} from "../utils/docIds.js";
import { RentOrder } from "../models/rentOrderModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    customer: { name, mobile },
    rentDate,
    returnDate,
    salesPerson,
    rentOrderDetails,
    totalPrice,
    subTotal,
    paymentType,
  } = req.body;

  // Check for required fields
  if (
    !mobile ||
    !name ||
    !rentDate ||
    !returnDate ||
    !salesPerson ||
    !rentOrderDetails ||
    !totalPrice ||
    !subTotal ||
    !paymentType
  ) {
    res.status(400);
    throw new Error("Required fields are not provided.");
  }
  let customer = undefined;
  customer = await Customer.findOne({ mobile }).lean().exec();
  if (!customer) {
    customer = await Customer.create({ name, mobile });
  }

  const salesPersonDoc = await getDocId(User, "userId", salesPerson);
  if (!salesPersonDoc) {
    res.status(404);
    throw new Error(`No user found for ID ${salesPerson}`);
  }

  const orderData = {
    ...req.body,
    customer: customer._id,
    salesPerson: salesPersonDoc,
  };

  const newOrder = await RentOrder.create(orderData);

  res.json({
    message: "New order created successfully.",
    success: true,
    data: newOrder,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await RentOrder.find()
    .select("-_id -__v")
    .populate({
      path: "customer",
      select: "-_id -createdAt -updatedAt -__v",
    })
    .populate(
      "salesPerson",
      "-createdAt -updatedAt -password -_id -__v -refreshToken"
    )
    .lean();

  if (!orders) {
    throw new Error("no orders found!");
  }
  res.json({
    message: "All Orders Fetched Successfully.",
    success: true,
    data: orders,
  });
});

export const searchSingleOrder = asyncHandler(async (req, res) => {
    const {rentItemId} = req.params

    if(!rentItemId) {
        throw new Error('Rent order Id not found')
    }
    
    const rentOrder = await RentOrder.findOne({'rentOrderDetails.rentItemId': rentItemId})
      .select("-_id -__v")
      .populate({
        path: "customer",
        select: "-_id -createdAt -updatedAt -__v",
      })
      .populate(
        "salesPerson",
        "-createdAt -updatedAt -password -_id -__v -refreshToken"
      )
      .lean();
  
    if (!rentOrder) {
      throw new Error("no orders found!");
    }
    res.json({
      message: "All Orders Fetched Successfully.",
      success: true,
      data: rentOrder,
    });
  });

export const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new Error("OrderId is not provided!");
  }
  const updateData = req.body;

  try {
    const updatedOrder = await SalesOrder.findByIdAndUpdate(
      orderId,
      { $set: filteredUpdateData },
      { new: true, runValidators: true }
    )
      .populate({
        path: "customer",
        select: "-_id -createdAt -updatedAt -__v",
      })
      .populate(
        "salesPerson",
        "-createdAt -updatedAt -password -_id -__v -refreshToken"
      )
      .lean();

    if (!updatedOrder) {
      res.status(404);
      throw new Error(`SalesOrder with ID ${orderId} not found.`);
    }

    res.json({
      message: "SalesOrder updated successfully.",
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
