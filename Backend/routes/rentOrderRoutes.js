import express from "express";
import {
  createOrder,
  getAllOrders,
  updateOrder,
  searchSingleOrder
} from "../controllers/rentOrderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/searchItem/:rentItemId", searchSingleOrder);
router.patch("/:orderId", updateOrder);

export default router;
