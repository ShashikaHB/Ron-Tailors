import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { buildPdf } from "../pdf/pdf-service/pdf-service.js";
import { Order } from "../models/orderModel.js";

export const getInvoice = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const orderData = await Order.findOne({ orderId })
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
  buildPdf(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    data
  );
});
