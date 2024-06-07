import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  login,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
