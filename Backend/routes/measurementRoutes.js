import express from "express";
import {
  createMeasurement,
  getAllMeasurements,
  getSingleMeasurement,
  updateMeasurement,
  deleteMeasurement,
  getPreviousMeasurements,
  getMeasurementData
} from "../controllers/measurementController.js";
import { measurementPrint } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", createMeasurement);
router.get("/", getAllMeasurements);
router.get('/printMeasurement', getMeasurementData);
router.get("/:measurementId", getSingleMeasurement);
router.patch("/:measurementId", updateMeasurement);
router.delete("/:measurementId", deleteMeasurement);
router.get('/:customerId/:productType', getPreviousMeasurements);


export default router;
