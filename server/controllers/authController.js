import {registerService,loginService} from "../service/authService.js"
export const registerCntroller=async(req,res)=>{
    try {
        const registeruser=await registerService(req.body)
        if(registeruser){
            res.status(200).json({
                message:"user registered successfully",
                data:registeruser
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({message:error.message || "internal server error"})
    }
}
export const loginController=async(req,res)=>{
    try {
        const userLogin =await loginService(req.body)
        if(userLogin){
            res.status(200).json({
                message:"user login successfully",
                data:userLogin
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({message:error.message || "internal server error"})
    }
}