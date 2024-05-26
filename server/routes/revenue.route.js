import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getAllRevenue,
  withdrawRevenue,
} from "../controllers/revenue.controller.js";

const router = express.Router();

router.post("/", verifyToken, getAllRevenue);
router.post("/withdraw", verifyToken, withdrawRevenue);

export default router;
