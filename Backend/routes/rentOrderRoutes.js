import express from "express";
import {
  createOrder,
  getAllOrders,
  updateOrder,
  getSingleRentOrder
} from "../controllers/rentOrderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/:rentItemId", getSingleRentOrder);
router.patch("/:orderId", updateOrder);

export default router;
