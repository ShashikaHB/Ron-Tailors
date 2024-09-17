import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  markAttendance,
  updateSalaryGrade,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router
  .get("/:id", getSingleUser)
  .patch("/:id", updateUser)
  .post("/attendance", markAttendance)
  .patch('/salary/:userId', updateSalaryGrade)
  .delete("/:id", deleteUser);

export default router;
