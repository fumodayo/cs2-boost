import express from "express";
import {
  acceptOrder,
  cancelOrder,
  completedOrder,
  createOrder,
  getAllOrder,
  getOrder,
  getPendingOrder,
  getProgressOrder,
} from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, getAllOrder);
router.get("/pending-order", verifyToken, getPendingOrder);
router.get("/progress-order", verifyToken, getProgressOrder);
router.get("/:id", verifyToken, getOrder);
router.post("/create-order", verifyToken, createOrder);
router.post("/accept-order/:id", verifyToken, acceptOrder);
router.post("/complete-order/:id", verifyToken, completedOrder);
router.post("/cancel-order/:id", verifyToken, cancelOrder);

export default router;
