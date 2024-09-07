import express from "express";
import { getRentInvoice, getSalesInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/salesOrder/:salesOrderId", getSalesInvoice);
router.get("/rentOrder/:rentOrderId", getRentInvoice);

export default router;
