import asyncHandler from "express-async-handler";
import { Customer } from "../models/customerModel.js";
import { User } from "../models/userModel.js";
import {
  getAutoGeneratedId,
  getDocId,
  getProductFields,
} from "../utils/docIds.js";
import { RentOrder } from "../models/rentOrderModel.js";
import { RentItem } from "../models/rentItemModel.js";
import { Transaction } from "../models/transactionModel.js";
import { sendSMS } from "../notificationSMS/smsNotification.js";

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

  const salesPersonDoc = await User.findOne({ userId: salesPerson })
  .lean()
  .exec();
if (!salesPersonDoc) {
  res.status(404);
  throw new Error(`No user found for ID ${salesPerson}`);
}

  const orderData = {
    ...req.body,
    customer: customer._id,
    salesPerson: salesPersonDoc._id,
  };

  const newOrder = await RentOrder.create(orderData);

  // Create a credit transaction
  const newTransaction = await Transaction.create({
    transactionType: "Income",
    transactionCategory: "Rent Order",
    paymentType: paymentType,
    salesPerson: salesPersonDoc.name,
    store: req.body?.store,
    amount: newOrder.advPayment,
    description: `Rent Order: ${newOrder.rentOrderId}`,
  });

  const messageBody = `Hi ${name}. Your Order Id is ${newOrder.rentOrderId}. Your order balance is ${newOrder?.balance}. Thank you come again.`
//   await sendSMS(messageBody, mobile);

  // Update the status of each rent item in the order to 'Not Returned'
  for (const detail of rentOrderDetails) {
    await RentItem.findOneAndUpdate(
      { rentItemId: detail.rentItemId },
      { status: "Not Returned" }
    );
  }

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

export const getSingleRentOrder = asyncHandler(async (req, res) => {
  const { rentOrderId } = req?.params;
  const rentOrder = await RentOrder.findOne({ rentOrderId })
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
    message: "Rent Order Fetched Successfully!",
    success: true,
    data: rentOrder,
  });
});

export const searchSingleOrder = asyncHandler(async (req, res) => {
  const { rentItemId } = req.params;

  if (!rentItemId) {
    throw new Error("Rent order Id not found");
  }

  const rentOrder = await RentOrder.findOne({
    "rentOrderDetails.rentItemId": rentItemId,
    orderStatus: { $ne: "Completed" },
  })
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
    throw new Error("No orders found!");
  }
  // Now that we have the customer's ID, find all other items rented by the same customer
  const customerId = rentOrder.customer._id;

  // Find all orders for this customer (including completed ones)
  const customerOrders = await RentOrder.find({
    customer: customerId,
    "rentOrderDetails.rentItemId": { $ne: rentItemId }, // Exclude the searched item itself
  })
    .select("-_id -__v")
    .populate({
      path: "rentOrderDetails.rentItemId",
      select: "description itemCategory itemType status",
    })
    .lean();

  if (!customerOrders || customerOrders.length === 0) {
    res.json({
      message: "Rent Order found, but no other items rented by the same customer.",
      success: true,
      data: {
        rentOrder,
        relatedItems: [],
      },
    });
  } else {
    // Extract all related items rented by the customer
    const relatedItems = customerOrders.map((order) => order.rentOrderDetails).flat();

    res.json({
      message: "Rent Order and related rent items found successfully!",
      success: true,
      data: {
        rentOrder,
        relatedItems,
      },
    });
  }
});

export const rentReturn = asyncHandler(async (req, res) => {
  const { rentOrderId } = req.params;

  // Find the rent order by rentOrderId
  const rentOrder = await RentOrder.findOne({ rentOrderId });

  if (!rentOrder) {
    res.status(404);
    throw new Error(`No rent order found with ID ${rentOrderId}`);
  }

  // Update the status of each rent item in the order to 'Available'
  const rentItemIds = rentOrder.rentOrderDetails.map((item) => item.rentItemId);

  await RentItem.updateMany(
    { rentItemId: { $in: rentItemIds } },
    { $set: { status: "Available" } }
  );
  // Update the status of the rent order to 'Completed'
  rentOrder.orderStatus = "Completed";
  await rentOrder.save();

  res.json({
    message: `All items in rent order ${rentOrderId} are now marked as 'Available'.`,
    success: true,
  });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { rentOrderId } = req.params;

  const {
    customer: { name, mobile },
    salesPerson,
  } = req.body;

  if (!rentOrderId) {
    throw new Error("rentOrderId is not provided!");
  }

  const rentOrder = await RentOrder.findOne({ rentOrderId }).lean().exec();

  if (!rentOrder) {
    throw new Error("No rent order Found!");
  }
  let customer = undefined;
  customer = await Customer.findOne({ mobile }).lean().exec();
  if (!customer) {
    customer = await Customer.create({ name, mobile });
  }
  const salesPersonDoc = await getDocId(User, "userId", salesPerson);

  const updateData = {
    ...req.body,
    customer: customer._id,
    salesPerson: salesPersonDoc,
  };

  const updatedOrder = await RentOrder.findByIdAndUpdate(
    rentOrder._id,
    { ...updateData },
    { new: true }
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
    throw new Error(`RentOrder with ID ${orderId} not found.`);
  }

  res.json({
    message: "SalesOrder updated successfully.",
    success: true,
    data: updatedOrder,
  });
});
