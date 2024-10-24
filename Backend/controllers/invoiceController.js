import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import {
  buildMeasurementPdf,
  buildOrderBookPdf,
  buildReadyMadePdf,
  buildRentPdf,
  buildRentShopPdf,
  buildSalesPdf,
} from "../pdf/pdf-service/pdf-service.js";
import { SalesOrder } from "../models/salesOrderModel.js";
import { RentOrder } from "../models/rentOrderModel.js";
import { ReadyMadeItem } from "../models/readyMadeItemModel.js";

export const getSalesInvoice = asyncHandler(async (req, res) => {
  const { salesOrderId } = req.params;

  const orderData = await SalesOrder.findOne({ salesOrderId })
    .lean()
    .populate("customer")
    .populate({
      path: "orderDetails.products",
      model: "Product",
    })
    .exec();

  const data = {
    customer: {
      name: orderData.customer.name,
      mobile: orderData.customer.mobile,
      orderDate: orderData.orderDate.toISOString().split("T")[0],
      deliveryDate: orderData.deliveryDate.toISOString().split("T")[0],
      weddingDate: orderData.weddingDate
        ? orderData.weddingDate.toISOString().split("T")[0]
        : null,
    },
    orderDetails: orderData.orderDetails.map((detail) => ({
      description: detail.description,
      items: [
        ...detail?.products.map((product) => product.itemType),
        ...detail?.rentItems.map((item) => item.itemType),
      ],
      amount: `Rs ${detail.amount.toFixed(2)}`,
    })),
    orderNo: orderData.salesOrderId,
    totals: {
      subTotal: `Rs ${orderData.subTotal.toFixed(2)}`,
      discount: orderData.discount
        ? `Rs ${orderData.discount.toFixed(2)}`
        : "Rs 0.00",
      totalPrice: `Rs ${orderData.totalPrice.toFixed(2)}`,
      advPayment: orderData.advPayment
        ? `Rs ${orderData.advPayment.toFixed(2)}`
        : "Rs 0.00",
      balance: orderData.balance
        ? `Rs ${orderData.balance.toFixed(2)}`
        : `Rs ${(orderData.totalPrice - orderData.advPayment).toFixed(2)}`,
    },
  };
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
  });
  buildSalesPdf(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    data
  );
});

export const getRentInvoice = asyncHandler(async (req, res) => {
  const { rentOrderId } = req.params;

  const orderData = await RentOrder.findOne({ rentOrderId: rentOrderId })
    .lean()
    .populate("customer")
    .exec();

  const data = {
    customer: {
      name: orderData.customer.name,
      mobile: orderData.customer.mobile,
      rentDate: orderData.rentDate.toISOString().split("T")[0],
      returnDate: orderData.returnDate.toISOString().split("T")[0],
    },
    rentOrderDetails: orderData.rentOrderDetails,
    orderNo: orderData.rentOrderId,
    totals: {
      subTotal: `Rs ${orderData.subTotal.toFixed(2)}`,
      discount: orderData.discount
        ? `Rs ${orderData.discount.toFixed(2)}`
        : "Rs 0.00",
      totalPrice: `Rs ${orderData.totalPrice.toFixed(2)}`,
      advPayment: orderData.advPayment
        ? `Rs ${orderData.advPayment.toFixed(2)}`
        : "Rs 0.00",
      balance: orderData.balance
        ? `Rs ${orderData.balance.toFixed(2)}`
        : `Rs ${(orderData.totalPrice - orderData.advPayment).toFixed(2)}`,
    },
  };
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
  });
  buildRentPdf(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    data
  );
});
export const getRentShopInvoice = asyncHandler(async (req, res) => {
  const { rentOrderId } = req.params;

  const orderData = await RentOrder.findOne({ rentOrderId: rentOrderId })
    .lean()
    .populate("customer")
    .exec();

  const data = {
    customer: {
      name: orderData.customer.name,
      mobile: orderData.customer.mobile,
      rentDate: orderData.rentDate.toISOString().split("T")[0],
      returnDate: orderData.returnDate.toISOString().split("T")[0],
      suitType: orderData.suitType,
    },
    rentOrderDetails: orderData.rentOrderDetails,
    orderNo: orderData.rentOrderId,
    totals: {
      subTotal: `Rs ${orderData.subTotal.toFixed(2)}`,
      discount: orderData.discount
        ? `Rs ${orderData.discount.toFixed(2)}`
        : "Rs 0.00",
      totalPrice: `Rs ${orderData.totalPrice.toFixed(2)}`,
      advPayment: orderData.advPayment
        ? `Rs ${orderData.advPayment.toFixed(2)}`
        : "Rs 0.00",
      balance: orderData.balance
        ? `Rs ${orderData.balance.toFixed(2)}`
        : `Rs ${(orderData.totalPrice - orderData.advPayment).toFixed(2)}`,
    },
  };
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
  });
  buildRentShopPdf(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    data
  );
});

export const getReadyMadeInvoice = asyncHandler(async (req, res) => {
  const { readyMadeOrderId } = req.params;

  const orderData = await ReadyMadeItem.findOne({ readyMadeOrderId })
    .lean()
    .populate("customer")
    .exec();

  const data = {
    customer: {
      name: orderData.customer.name,
      mobile: orderData.customer.mobile,
      orderDate: new Date().toISOString().split("T")[0],
    },
    orderDetails: [
      { description: orderData.itemType, amount: `Rs ${orderData.price}` },
    ],
    orderNo: orderData.readyMadeItemId,
    totals: {
      totalPrice: `Rs ${orderData.price.toFixed(2)}`,
      balance: "Rs 0.00",
    },
  };
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
  });
  buildReadyMadePdf(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    data
  );
});

export const measurementPrint = asyncHandler(async (req, res) => {
  const { startDate, endDate, itemType } = req.query;

  if (!startDate || !endDate || !itemType) {
    return res.status(400).json({
      message: "startDate, endDate, and itemType are required.",
      success: false,
    });
  }

  // Convert the start and end date into the correct format, including time.
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setUTCHours(23, 59, 59, 999); // Ensure we capture all records for that day.

  // Step 1: Fetch all sales orders within the date range without filtering on itemType yet.
  const orders = await SalesOrder.find({
    orderDate: { $gte: start, $lte: end },
  })
    .populate({
      path: "orderDetails.products",
      populate: {
        path: "measurement", // Populate measurement details
        select: "-__v -createdAt -updatedAt", // Exclude unnecessary fields
        populate: {
          path: "customer", // Populate customer inside measurement
          select: "name mobile", // Only select relevant fields from customer
        },
      },
    })
    .lean(); // Lean makes sure we get plain JavaScript objects instead of Mongoose documents

  // Debugging log to check if orders are fetched
  console.log("Orders Fetched: ", orders);

  // Step 2: Manually filter the products to get measurements for the given itemType.
  const measurements = [];

  orders.forEach((order) => {
    order.orderDetails.forEach((detail) => {
      detail.products.forEach((product) => {
        if (product.itemType === itemType && product.measurement) {
          measurements.push(product.measurement); // Push the measurement to the result
        }
      });
    });
  });

  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
  });
  buildMeasurementPdf(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    measurements
  );
});
export const orderBookPrint = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      message: "Delivery date is required!",
      success: false,
    });
  }

  // Convert the start and end date into the correct format, including time.
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00.000

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59.999

  // Query orders that fall within the start and end of the day
  const orders = await SalesOrder.find({
    deliveryDate: {
      $gte: startOfDay, // Greater than or equal to the start of the day
      $lt: endOfDay, // Less than the end of the day
    },
  })
    .populate({
      path: "orderDetails.products",
    })
    .populate({ path: "customer" })
    .lean();
  let items = [];

  const formattedData = orders.map((order) => {
    let items = [];
    order?.orderDetails?.map((detail) => {
      detail.products.forEach((product) => {
        items.push({
          productType: product.itemType,
          description: detail.description,
        });
      });

      // Push rentItems data to items array
      detail.rentItems.forEach((item) => {
        items.push({
          productType: item.itemType,
          description: detail.description,
        });
      });
    });

    return {
      customer: order.customer,
      orderData: items,
      salesOrderId: order.salesOrderId,
    };
  });

  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
  });
  buildOrderBookPdf(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    formattedData,
    date
  );
});
