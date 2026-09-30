import express from "express";
import {createCategoryController,getCategoryController,getCategoryByIdController} from "../controllers/categoryController.js"
import auth from "../middleware/auth.js";
const router = express.Router();
router.get("/",auth,getCategoryController)
router.post("/",auth,createCategoryController);
router.get("/:id",auth,getCategoryByIdController)

export default router;