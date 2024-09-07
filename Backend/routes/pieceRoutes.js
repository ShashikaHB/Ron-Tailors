import express from "express";
import {
    getPiecePricesByType,
    deletePiecePricesByType,
    createPiecePrices,
    updatePiecePrices
} from "../controllers/pieceController.js";

const router = express.Router();

router.post("/", createPiecePrices); // For creating or updating piece prices
router.get("/:type", getPiecePricesByType); // For getting piece prices by type
router.patch("/:type", updatePiecePrices); // For getting piece prices by type
router.delete("/:type", deletePiecePricesByType); // For deleting piece prices by type


export default router;