import { createTransactionService,getTransactionService ,getTransactionServiceById,updateTransactionService,deleteTransactionService} from "../service/transactionService.js"
export const createTransactionController=async(req,res)=>{
    const user_id=req.user.id
    try {
        const result=await createTransactionService(req.body,user_id)
        if(result){
            res.status(200).json({
                message:"transaction created successfully",
                data:result
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            message:"error creating transaction",
            error:error.message
        })
    }
    
}
export const getTransactionController=async(req,res)=>{
    const user_id=req.user.id
    try {
        const result=await getTransactionService(user_id)
        if(result){
            res.status(200).json({
                message:"transaction fetched successfully",
                data:result
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            message:"error fetching transaction",
            error:error.message
        })
    }
}
export const getTransactionByIdController=async(req,res)=>{
    const user_id=req.user.id
    const transaction_id=req.params.id
    try {
        const result=await getTransactionServiceById(user_id,transaction_id)
        if(result){
            res.status(200).json({
                message:"transaction fetched successfully",
                data:result
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            message:"error fetching transaction",
            error:error.message
        })
    }
}
export const updateTransactionController=async(req,res)=>{
    const user_id=req.user.id
    const transaction_id=req.params.id
    try {
        const result=await updateTransactionService(user_id,transaction_id,req.body)
        if(result){
            res.status(200).json({
                message:"transaction updated successfully",
                data:result
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            message:"error updating transaction",
            error:error.message
        })
    }
}
export const deleteTransactionController=async(req,res)=>{
    const user_id=req.user.id
    const transaction_id=req.params.id
    try {
        const result=await deleteTransactionService(user_id,transaction_id)
        if(result){
            res.status(200).json({
                message:"transaction deleted successfully",
                data:result
            })
        }
    }catch(error){
        res.status(error.status || 500).json({
            message:"error deleting transaction",
            error:error.message
        })
    }
        }

