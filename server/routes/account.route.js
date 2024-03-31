import express from "express";
import { verifyToken } from "../utils/verifyUser.js";

import { createAccount } from "../controllers/account.controller.js";

const router = express.Router();

router.post("/create-account", verifyToken, createAccount);

export default router;
