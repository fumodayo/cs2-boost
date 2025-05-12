import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  connectSocialMediaUser,
  getBooster,
  getUser,
  updateUser,
  verificationUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/booster/:id", getBooster);
router.get("/get/:id", verifyToken, getUser);
router.post("/update/:id", verifyToken, updateUser);
router.post("/verification/:id", verifyToken, verificationUser);
router.post("/connect-social-media/:id", verifyToken, connectSocialMediaUser);

export default router;
