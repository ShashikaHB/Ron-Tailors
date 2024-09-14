import express from "express";
import {
    getAllPiecePrices,
    updatePiecePrices
} from "../controllers/pieceController.js";

const router = express.Router();

router.post("/", updatePiecePrices); // For creating or updating piece prices
router.get("/", getAllPiecePrices); // For getting piece prices by type



export default router;