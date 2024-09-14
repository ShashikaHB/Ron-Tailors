import express from "express";
import {
  createReadyMadeItemOrder,
  deleteReadyMadeItem,
  getAllReadyMadeItems,
  getSingleReadyMadeItem,
  updateReadyMadeItem,
} from "../controllers/readyMadeItemsController.js";

const router = express.Router();

router.post("/", createReadyMadeItemOrder);
router.get("/", getAllReadyMadeItems);
router.get("/:id", getSingleReadyMadeItem);
router.patch("/:id", updateReadyMadeItem);
router.delete("/:id", deleteReadyMadeItem);

export default router;
