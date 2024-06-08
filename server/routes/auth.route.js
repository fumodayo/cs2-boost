import express from "express";

import {
  google,
  logoutAll,
  refreshToken,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/refresh-token", refreshToken);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/signout", verifyToken, signout);
router.post("/logout-all", verifyToken, logoutAll);

export default router;
