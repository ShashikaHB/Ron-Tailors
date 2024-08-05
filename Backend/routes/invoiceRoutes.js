import express from "express";
import { getRentInvoice, getSalesInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/salesOrder/:orderId", getSalesInvoice);
router.get("/rentOrder/:orderId", getRentInvoice);

export default router;
