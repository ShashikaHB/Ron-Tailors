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

  const salesPersonDoc = await getDocId(User, "userId", salesPerson);
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

  const newOrder = await SalesOrder.create(orderData);

  // Create a credit transaction
  await Transaction.create({
    type: "Credit",
    amount: newOrder.subTotal,
    description: `Sales Order ${newOrder.salesOrderId}`,
  });

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
