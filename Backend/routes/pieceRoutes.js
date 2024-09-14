import express from "express";
import {
    getAllPiecePrices,
    createEditPiecePrices
} from "../controllers/pieceController.js";

const router = express.Router();

router.post("/", createEditPiecePrices); // For creating or updating piece prices
router.get("/", getAllPiecePrices); // For getting piece prices by type



export default router;