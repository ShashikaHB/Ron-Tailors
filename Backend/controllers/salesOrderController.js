import asyncHandler from "express-async-handler";
import { Customer } from "../models/customerModel.js";
import { SalesOrder } from "../models/salesOrderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import {
  getAutoGeneratedId,
  getDocId,
  getProductFields,
} from "../utils/docIds.js";
import { Material } from "../models/materialModel.js";
import { Transaction } from "../models/transactionModel.js";
import { updateDailySummary } from "../utils/updateDailySummary.js";
import { RentOrder } from "../models/rentOrderModel.js";
import { sendSMS } from "../notificationSMS/smsNotification.js";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    customer: { name, mobile },
    orderDate,
    deliveryDate,
    salesPerson,
    orderDetails,
    totalPrice,
    subTotal,
    paymentType,
  } = req.body;

  // Check for required fields
  if (
    !mobile ||
    !name ||
    !orderDate ||
    !deliveryDate ||
    !salesPerson ||
    !orderDetails ||
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

  // Loop through the orderDetails array and replace productId with the corresponding _id
  const orderDetailsData = await Promise.all(
    orderDetails.map(async (detail) => {
      const productsData = await Promise.all(
        detail.products.map(async (productId) => {
          const product = await getDocId(Product, "productId", productId);
          if (!product) {
            throw new Error(`No product found for ID ${productId}`);
          }
          return product._id; // Return only the _id of the product
        })
      );

      return {
        description: detail.description,
        category: detail?.category,
        products: productsData,
        amount: detail.amount
      };
    })
  );

  const orderData = {
    ...req.body,
    customer: customer._id,
    salesPerson: salesPersonDoc._id,
    orderDetails: orderDetailsData,
  };

  const newOrder = await SalesOrder.create(orderData);

  // Create a credit transaction
  const newTransaction = await Transaction.create({
    transactionType: "Income",
    transactionCategory: "Sales Order",
    paymentType: paymentType,
    salesPerson: salesPersonDoc.name,
    store: req.body?.store,
    amount: newOrder.advPayment,
    description: `Sales Order: ${newOrder.salesOrderId}`,
  });

  await updateDailySummary(newTransaction);
  const messageBody = `Hi ${name}. Your Order Id is ${newOrder.salesOrderId}. Your order balance is ${newOrder?.balance}. Thank you come again.`
  await sendSMS(messageBody, mobile);



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
  const orders = await SalesOrder.find()
    .populate({
      path: "customer",
      select: "-_id -createdAt -updatedAt -__v",
    })
    .populate(
      "salesPerson",
      "-createdAt -updatedAt -password -_id -__v -refreshToken"
    )
    .lean();

  const ordersWithProductFields = await Promise.all(
    orders.map(async (order) => {
      const orderDetails = await Promise.all(
        order.orderDetails.map(async (detail) => {
          const products = await Promise.all(
            detail.products.map(async (product) => {
              const productFields = await getProductFields(product._id);
              return productFields;
            })
          );
          return {
            ...detail,
            products,
          };
        })
      );

      return {
        ...order,
        orderDetails,
      };
    })
  );

  res.json({
    message: "All Orders Fetched Successfully.",
    success: true,
    data: ordersWithProductFields,
  });
});

export const getSingleSalesOrder = asyncHandler(async (req, res) => {
  const { salesOrderId } = req?.params;

  const salesOrder = await SalesOrder.findOne({ salesOrderId })
    .populate({
      path: "customer",
      select: "-_id -createdAt -updatedAt -__v",
    })
    .populate(
      "salesPerson",
      "-createdAt -updatedAt -password -_id -__v -refreshToken"
    )
    .lean();

  const orderWithProductFields = await Promise.all(
    salesOrder.orderDetails.map(async (detail) => {
      const products = await Promise.all(
        detail.products.map(async (product) => {
          const productFields = await getProductFields(product._id);
          return productFields;
        })
      );
      return {
        ...detail,
        products,
      };
    })
  );

  res.json({
    message: "Sales Order Fetched Successfully.",
    success: true,
    data: { ...salesOrder, orderDetails: orderWithProductFields },
  });
});

export const updateSalesOrder = asyncHandler(async (req, res) => {
  const {
    customer: { name, mobile },
    orderDate,
    deliveryDate,
    salesPerson,
    orderDetails,
    totalPrice,
    subTotal,
    paymentType,
  } = req.body;

  const { salesOrderId } = req?.params;

  if (!salesOrderId) {
    throw new Error("OrderId is not provided!");
  }

  const salesOrder = await SalesOrder.findOne({ salesOrderId }).lean().exec();
  if (!salesOrder) {
    throw new Error("No sales order found");
  }

  let customer = undefined;
  customer = await Customer.findOne({ mobile }).lean().exec();
  if (!customer) {
    customer = await Customer.create({ name, mobile });
  }
  const salesPersonDoc = await getDocId(User, "userId", salesPerson);

  // Loop through the orderDetails array and replace productId with the corresponding _id
  const orderDetailsData = await Promise.all(
    orderDetails.map(async (detail) => {
      const productsData = await Promise.all(
        detail.products.map(async (productId) => {
          const product = await getDocId(Product, "productId", productId);
          if (!product) {
            throw new Error(`No product found for ID ${productId}`);
          }
          return product._id; // Return only the _id of the product
        })
      );

      return {
        description: detail.description,
        products: productsData,
      };
    })
  );

  const orderData = {
    ...req.body,
    customer: customer._id,
    salesPerson: salesPersonDoc,
    orderDetails: orderDetailsData,
  };

  const updateOrder = await SalesOrder.findByIdAndUpdate(
    salesOrder._id,
    {
      ...orderData,
    },
    {
      new: true,
    }
  );

  res.json({
    message: "Sales order updated successfully.",
    success: true,
    data: updateOrder,
  });
});

export const getSalesOrderOrRentOrderForPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  let order = null;
  let transactions = [];

  // Determine if it's a Sales Order or Rent Order based on prefix (e.g., "RW" or "KE")

  // Check in SalesOrder collection
  order = await SalesOrder.findOne({ salesOrderId: orderId })
    .populate("customer", "name mobile")
    .lean()
    .exec();

  // If no Sales Order found, check in RentOrder collection
  if (!order) {
    order = await RentOrder.findOne({ rentOrderId: orderId })
      .populate("customer", "name mobile")
      .lean()
      .exec();
  }

  // If no order found, return an error
  if (!order) {
    res.status(404);
    throw new Error(`No order found with ID: ${orderId}`);
  }

  // Find related transactions based on the orderId in the description
  transactions = await Transaction.find({
    description: new RegExp(orderId, "i"), // Search transactions that contain orderId in the description
  })
    .lean()
    .exec();

  // Return the order details and transactions
  res.json({
    message: `order fetched successfully.`,
    success: true,
    data: {
      order,
      transactions,
    },
  });
});

export const updateSalesOrRentOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { paymentAmount, paymentType } = req.body;
  
    // Validate input
    if (!paymentAmount || !paymentType) {
      res.status(400);
      throw new Error("Payment amount and payment type are required.");
    }
  
    let order = null;
    let orderType = "";
    let balance = 0;
  
    // Check if it's a Sales Order or Rent Order based on the orderId prefix
    if (orderId.startsWith("RW") || orderId.startsWith("KE")) {
      // Check in SalesOrder
      order = await SalesOrder.findOne({ salesOrderId: orderId }).exec();
      orderType = "Sales Order";
    }
  
    if (!order) {
      // If no SalesOrder is found, check in RentOrder
      order = await RentOrder.findOne({ rentOrderId: orderId }).exec();
      orderType = "Rent Order";
    }
  
    if (!order) {
      res.status(404);
      throw new Error(`Order not found with ID: ${orderId}`);
    }
  
    // Calculate the new balance
    const updatedAdvPayment = (order.advPayment || 0) + paymentAmount;
    balance = order.totalPrice - updatedAdvPayment;
  
    // Update the order with the new payment and balance
    order.advPayment = updatedAdvPayment;
    order.balance = balance;
    order.paymentType = paymentType;
  
    // Save the updated order
    const updatedOrder = await order.save();
  
    // Create a new transaction
    const newTransaction = await Transaction.create({
      transactionType: "Income",
      transactionCategory: orderType,
      paymentType: paymentType,
      salesPerson: order.salesPerson, // Assuming this is already populated with user info
      store: order.store,
      amount: paymentAmount,
      description: `${orderType}: ${orderId}`, // Include orderId in the transaction description
    });

    const messageBody = `Hi ${order.customer.name}. Your order balance is ${newOrder?.balance}. Thank you come again.`
    await sendSMS(messageBody, order.customer.mobile);
  
    // Return the updated order and new transaction
    res.json({
      message: "Payment updated successfully.",
      success: true,
      data: {
        updatedOrder,
        transaction: newTransaction,
      },
    });
  });