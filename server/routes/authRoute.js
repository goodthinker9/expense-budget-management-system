import express from "express"
import { registerCntroller,loginController} from "../controllers/authController.js"
const router = express.Router()

router.post("/register",registerCntroller)
router.post("/login",loginController)
export default router