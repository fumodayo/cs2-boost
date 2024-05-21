import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getAllRevenue } from "../controllers/revenue.controller.js";

const router = express.Router();

router.post("/", verifyToken, getAllRevenue);

export default router;
