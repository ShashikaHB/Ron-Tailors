import express from "express";
import {
  createMaterial,
  deleteMaterial,
  getAllMaterials,
  getSingleMaterial,
  updateMaterial,
} from "../controllers/materialController.js";

const router = express.Router();

router.post("/", createMaterial);
router.get("/", getAllMaterials);
router.get("/:materialId", getSingleMaterial);
router.patch("/:materialId", updateMaterial);
router.delete("/:materialId", deleteMaterial);

export default router;
