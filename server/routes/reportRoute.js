import express from "express";
import auth from "../middleware/auth.js";
import { getReportController,getReportByCategoryController,getDashboardReportController} from "../controllers/reportController.js";
const router = express.Router();
router.get("/monthly", auth, getReportController);
router.get("/category", auth, getReportByCategoryController);
router.get("/dashboard", auth, getDashboardReportController);
export default router;