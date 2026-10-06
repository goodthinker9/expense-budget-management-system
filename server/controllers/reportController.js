import {getReportService} from "../service/reportService.js"
export const getReportController=async(req,res)=>{
    const user_id=req.user.id
    const {month}=req.query
    try {
        const result=await getReportService(user_id,month)
        if(result){
            res.status(200).json({
                message:"you get the report successfully",
                result
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            message:error.message || "internal server error"
        })
    }
}