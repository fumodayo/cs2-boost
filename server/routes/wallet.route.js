import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getAllWallet } from "../controllers/wallet.controller.js";

const router = express.Router();

router.get("/", verifyToken, getAllWallet);

export default router;
