import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getNotifications,
  readNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:id", verifyToken, getNotifications);
router.post("/read/:id", verifyToken, readNotification);

export default router;
