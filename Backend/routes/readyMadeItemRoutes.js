import express from "express";
import {
  createReadyMadeItem,
  deleteReadyMadeItem,
  getAllReadyMadeItems,
  getSingleReadyMadeItem,
  updateReadyMadeItem,
} from "../controllers/readyMadeItemsController.js";

const router = express.Router();

router.post("/", createReadyMadeItem);
router.get("/", getAllReadyMadeItems);
router.get("/:id", getSingleReadyMadeItem);
router.patch("/:id", updateReadyMadeItem);
router.delete("/:id", deleteReadyMadeItem);

export default router;
