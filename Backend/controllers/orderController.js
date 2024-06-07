import asyncHandler from "express-async-handler";
import { Customer } from "../models/customerModel.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    customer,
    orderDetails,
    salesPerson,
    totalPrice,
    discount,
    advPayment,
    paymentType,
    isNewRentOut,
  } = req.body;

  // Validate customer existence
  const existingCustomer = await Customer.findById(customer);
  if (!existingCustomer) {
    if (!req.body?.customerMobile) {
      res.status(400);
      throw new Error("Customer details are required in order details");
    }
    const newCustomer = await Customer.create({
      name: req.body?.customerName,
      mobile: req.body?.customerMobile,
    });
    existingCustomer = newCustomer;
  }

  // Validate sales person existence
  const existingSalesPerson = await User.findById(salesPerson);
  if (!existingSalesPerson) {
    res.status(400);
    throw new Error("Sales person not found");
  }

  // Array to store product IDs after creation
  const createdProductIds = [];

  // Create or find products for each order item
  for (let i = 0; i < orderDetails.length; i++) {
    const orderItem = orderDetails[i];

    const newProduct = await Product.create({
      color: orderItem.color,
      style: orderItem.style,
      type: orderItem.type,
      measurements: orderItem.measurements,
      cost: orderItem.cost,
      price: orderItem.price,
      noOfUnits: orderItem.noOfUnits,
      status: orderItem.status,
      fitOnRounds: orderItem.fitOnRounds,
      cutter: orderItem.cutter,
      tailor: orderItem.tailor,
      measurer: orderItem.measurer,
    });

    // Push the created product's ID to the array
    createdProductIds.push(newProduct._id);
  }

  // Create new order
  const newOrder = await Order.create({
    customer: existingCustomer._id,
    orderDetails: createdProductIds,
    salesPerson: existingSalesPerson._id,
    totalPrice,
    discount,
    advPayment,
    paymentType,
    isNewRentOut,
  });

  res.json({
    message: "Order created Successfully.",
    success: true,
    data: newOrder,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("customer", "name mobile")
    .populate("salesPerson", "name")
    .populate({
      path: "orderDetails",
      populate: [
        { path: "materials", select: "color unitPrice" },
        { path: "cutter", select: "name" },
        { path: "tailor", select: "name" },
        { path: "measurer", select: "name" },
      ],
    });
  res.json({
    message: "All Orders Fetched Successfully.",
    success: true,
    data: orders,
  });
});
