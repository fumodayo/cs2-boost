import express from "express";
import {
  acceptOrder,
  createOrder,
  getAllOrder,
  getOrder,
  getPendingOrder,
} from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, getAllOrder);
router.get("/pending-order", verifyToken, getPendingOrder);
router.get("/:id", verifyToken, getOrder);
router.post("/create-order", verifyToken, createOrder);
router.post("/accept-order/:id", verifyToken, acceptOrder);

export default router;
