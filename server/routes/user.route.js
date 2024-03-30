import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  deleteUser,
  getUser,
  updateUser,
  verificationUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/get/:id", verifyToken, getUser);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/verification/:id", verifyToken, verificationUser);

export default router;
