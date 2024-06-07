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
router.get("/:id", getSingleMaterial);
router.patch("/:id", updateMaterial);
router.delete("/:id", deleteMaterial);

export default router;
