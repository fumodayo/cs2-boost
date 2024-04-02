import express from "express";
import {
  createOrder,
  getAllOrder,
  getOrder,
} from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, getAllOrder);
router.get("/:id", verifyToken, getOrder);
router.post("/create-order", verifyToken, createOrder);

export default router;
