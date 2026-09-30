import express from "express";
import {createCategoryController,getCategoryController,getCategoryByIdController,updateCategoryController,deleteCategoryController} from "../controllers/categoryController.js"
import auth from "../middleware/auth.js";
const router = express.Router();
router.get("/",auth,getCategoryController)
router.post("/",auth,createCategoryController);
router.get("/:id",auth,getCategoryByIdController)
router.put("/:id",auth,updateCategoryController)
router.delete("/:id",auth,deleteCategoryController)

export default router;