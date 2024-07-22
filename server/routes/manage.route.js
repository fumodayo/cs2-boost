import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getPremierPrice,
  getWingmanPrice,
  updatePremierPrice,
  updateWingmanPrice,
} from "../controllers/manage.controller.js";

const router = express.Router();

router.get("/wingman", getWingmanPrice);
router.get("/premier", getPremierPrice);
router.post("/wingman", verifyToken, updateWingmanPrice);
router.post("/premier", verifyToken, updatePremierPrice);

export default router;
