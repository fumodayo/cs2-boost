import express from "express";
import { paymentOrder } from "../controllers/payment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create-payment", verifyToken, paymentOrder);

export default router;
