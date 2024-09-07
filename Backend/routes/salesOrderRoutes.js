import express from "express";
import {
  createOrder,
  getAllOrders,
  getSingleSalesOrder,
  updateSalesOrder,
} from "../controllers/salesOrderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/:salesOrderId", getSingleSalesOrder);
router.patch("/:salesOrderId", updateSalesOrder);

export default router;
