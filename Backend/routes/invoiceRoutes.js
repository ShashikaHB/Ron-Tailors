import express from "express";
import { getRentInvoice, getSalesInvoice, measurementPrint } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/salesOrder/:salesOrderId", getSalesInvoice);
router.get("/rentOrder/:rentOrderId", getRentInvoice);
router.get('/measurements', measurementPrint)

export default router;
