import express from "express";
import {
  createOrder,
  getAllOrders,
  updateOrder,
} from "../controllers/salesOrderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.patch("/:orderId", updateOrder);

export default router;
