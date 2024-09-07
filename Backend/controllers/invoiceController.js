import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { buildRentPdf, buildSalesPdf } from "../pdf/pdf-service/pdf-service.js";
import { SalesOrder } from "../models/salesOrderModel.js";
import { RentOrder } from "../models/rentOrderModel.js";

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
      items: detail.products.map((product) => product.type),
      amount: `Rs${detail.products
        .reduce((total, product) => total + product.price, 0)
        .toFixed(2)}`,
    })),
    orderNo: orderData.salesOrderId,
    totals: {
      subTotal: `Rs${orderData.subTotal.toFixed(2)}`,
      discount: orderData.discount
        ? `Rs${orderData.discount.toFixed(2)}`
        : "Rs0.00",
      totalPrice: `Rs${orderData.totalPrice.toFixed(2)}`,
      advPayment: orderData.advPayment
        ? `Rs${orderData.advPayment.toFixed(2)}`
        : "Rs0.00",
      balance: orderData.balance
        ? `Rs${orderData.balance.toFixed(2)}`
        : `Rs${(orderData.totalPrice - orderData.advPayment).toFixed(2)}`,
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
      totalPrice: `Rs${orderData.totalPrice.toFixed(2)}`,
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
