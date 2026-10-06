import express from "express";
import auth from "../middleware/auth.js";
import { getReportController } from "../controllers/reportController.js";
const router = express.Router();
router.get("/monthly", auth, getReportController);
export default router;