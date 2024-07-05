import express from "express";
import {
  handleRefreshToken,
  registerUser,
  login,
  handleLogOut,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/refresh", handleRefreshToken);
router.get("/logout", handleLogOut);

export default router;
