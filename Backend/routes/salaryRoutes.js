import express from "express";
import { createSalary, getSalary, updateSalary } from "../controllers/salaryController.js";


const router = express.Router();

router.get("/", getSalary);
router.post("/", createSalary)
router.patch("/", updateSalary);

export default router;