import express from "express";
import { getAllMonthlyRecords } from "../controllers/monthlySummaryController.js";

const router = express.Router();

router.get("/", getAllMonthlyRecords);

export default router;
