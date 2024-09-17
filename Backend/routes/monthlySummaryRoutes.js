import express from "express";
import { getAllMonthlyRecords } from "../controllers/monthlySummaryController.js";

const router = express.Router();

router.get("/:month", getAllMonthlyRecords);

export default router;
