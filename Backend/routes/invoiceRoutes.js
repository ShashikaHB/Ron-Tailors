import express from "express";
import { getReadyMadeInvoice, getRentInvoice, getRentShopInvoice, getSalesInvoice, measurementPrint } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/salesOrder/:salesOrderId", getSalesInvoice);
router.get("/rentOrder/customer/:rentOrderId", getRentInvoice);
router.get("/rentOrder/shop/:rentOrderId", getRentShopInvoice);
router.get("/readyMadeOrder/:readyMadeOrderId", getReadyMadeInvoice);
router.get('/measurements', measurementPrint)

export default router;
