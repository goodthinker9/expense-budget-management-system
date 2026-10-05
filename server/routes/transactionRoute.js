import express from "express";
import auth from "../middleware/auth.js";
import { createTransactionController,getTransactionController,getTransactionByIdController ,updateTransactionController,deleteTransactionController} from "../controllers/transactionController.js";
const router = express.Router();
router.post("/",auth,createTransactionController)
router.get("/",auth,getTransactionController)
router.get("/:id",auth,getTransactionByIdController)
router.put("/:id",auth,updateTransactionController)
router.delete("/:id",auth,deleteTransactionController)
export default router;