import {getAllUserService,getUserServiceById} from "../service/meService.js"
export const getMeController=async(req,res)=>{
    const userId=req.user.id
    try {
        const user=await getAllUserService(userId)
        if(user){
            res.status(200).json({
            message:"user data fetched successfully",
            data:user
        })
        }
        
    } catch (error) {
        res.status(error.status || 500).json({message:error.message || "internal server error"})
    }
}
export const getMeControllerById=async(req,res)=>{
    try {
        const user=await getUserServiceById(req.params.id)
        if(user){
            res.status(200).json({
                message:"user data fetched successfully",
                data:user
            })
        }else{
            res.status(404).json({message:"user not found"})
            }
        }
    catch (error) {
        res.status(error.status || 500).json({message:error.message || "internal server error"})
    }
}