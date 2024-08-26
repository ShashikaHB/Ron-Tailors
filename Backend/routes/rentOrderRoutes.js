import express from "express";
import {
  createOrder,
  getAllOrders,
  updateOrder,
  searchSingleOrder,
  getSingleRentOrder,
  rentReturn
} from "../controllers/rentOrderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/:rentOrderId", getSingleRentOrder);
router.patch("/:rentOrderId", updateOrder);
router.post("/rentReturn/:rentOrderId", rentReturn);
router.get("/searchItem/:rentItemId", searchSingleOrder);

export default router;
