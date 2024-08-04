import express from "express";
import { createRentItem, deleteRentItem, getAllRentItems, getSingleRentItem, searchRentItem, updateRentItem } from "../controllers/rentItemController.js";

const router = express.Router();

router.post("/", createRentItem);
router.get("/", getAllRentItems);
router.get("/searchRentItem", searchRentItem);
router.get("/:rentItemId", getSingleRentItem);
router.patch("/:rentItemId", updateRentItem);
router.delete("/:rentItemId", deleteRentItem);

export default router;
