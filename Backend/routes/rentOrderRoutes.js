import express from "express";
import {
  searchSingleOrder,
  getSingleRentOrder,
  rentReturn,
  createRentOrder,
  updateRentOrder,
  getAllRentOrders,
  deleteRentOrders
} from "../controllers/rentOrderController.js";

const router = express.Router();

router.get("/", getAllRentOrders);
router.post("/", createRentOrder);
router.get("/:rentOrderId", getSingleRentOrder);
router.patch("/:rentOrderId", updateRentOrder);
router.post("/rentReturn/:rentItemId", rentReturn);
router.get("/searchItem/:rentItemId", searchSingleOrder);
router.delete("/:rentOrderId", deleteRentOrders)

export default router;
