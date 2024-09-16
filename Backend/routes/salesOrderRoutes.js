import express from "express";
import {
  createOrder,
  getAllOrders,
  getSalesOrderOrRentOrderForPayment,
  getSingleSalesOrder,
  updateSalesOrder,
  updateSalesOrRentOrder,
} from "../controllers/salesOrderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/:salesOrderId", getSingleSalesOrder);
router.patch("/:salesOrderId", updateSalesOrder);
router.get('/payment/:orderId', getSalesOrderOrRentOrderForPayment)
router.post('/payment/:orderId', updateSalesOrRentOrder)


export default router;
