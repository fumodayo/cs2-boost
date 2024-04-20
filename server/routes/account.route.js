import express from "express";
import { verifyToken } from "../utils/verifyUser.js";

import {
  createAccount,
  editAccount,
} from "../controllers/account.controller.js";

const router = express.Router();

router.post("/create-account", verifyToken, createAccount);
router.post("/edit-account", verifyToken, editAccount);

export default router;
