import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  searchCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/", createCustomer);
router.get("/", getAllCustomers);
router.get("/searchCustomer", searchCustomer);
router.get("/:id", getSingleCustomer);

export default router;
