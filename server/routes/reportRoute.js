import express from "express";
import auth from "../middleware/auth.js";
import { getReportController,getReportByCategoryController } from "../controllers/reportController.js";
const router = express.Router();
router.get("/monthly", auth, getReportController);
router.get("/category", auth, getReportByCategoryController);
export default router;