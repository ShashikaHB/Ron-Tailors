import express from "express";
import {
  createMeasurement,
  getAllMeasurements,
  getSingleMeasurement,
  updateMeasurement,
  deleteMeasurement,
} from "../controllers/measurementController.js";

const router = express.Router();

router.post("/", createMeasurement);
router.get("/", getAllMeasurements);
router.get("/:measurementId", getSingleMeasurement);
router.patch("/:measurementId", updateMeasurement);
router.delete("/:measurementId", deleteMeasurement);

export default router;
