import express from "express";
import { createOrder, getAllOrders } from "../controllers/salesOrderController.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  searchProduct,
  updateProduct,
  updateProductStatus,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/searchProduct", searchProduct);
router.patch("/:productId", updateProduct);
router.patch("/updateStatus/:productId", updateProductStatus);
router.get("/:productId", getSingleProduct);
router.delete("/:productId", deleteProduct);

export default router;
