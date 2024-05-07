import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:id", verifyToken, getNotifications);

export default router;
