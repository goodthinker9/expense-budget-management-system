import express from "express"
import { registerCntroller,loginController} from "../controllers/authController.js"
import {getMeController} from "../controllers/meController.js"
import auth from "../middleware/auth.js"
import {authorize} from "../middleware/authorize.js"
import {getMeControllerById} from "../controllers/meController.js"
const router = express.Router()

router.post("/register",registerCntroller)
router.post("/login",loginController)
router.get("/me",auth,authorize("user"),getMeController)
router.get("/me/:id",auth,authorize("user"),getMeControllerById)
export default router