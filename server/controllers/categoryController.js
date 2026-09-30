import {getCategoryService,createCategoryService,getCategoryByIdService,updateCategoryService,deleteCategoryService} from "../service/categoryService.js"
export const createCategoryController=async(req,res)=>{
    try {
        const user_id = req.user.id;
        const {name,type}=req.body

        const createCategory=await createCategoryService({user_id,name,type})
        if(!createCategory){
             res.status(400).json({message:"category not created"})
             createCategory
        }
    }catch (error) {
        res.status(error.status || 500).json({message: error.message})
    }
}
export const getCategoryController=async(req,res)=>{
    const user_id=req.user.id
    // console.log(user_id)
    try {
        const result=await getCategoryService(user_id)
        if(result){
            res.status(200).json({
                message:"you get the category sucessfully ",
                result
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            messsage:error.message || "internal server error"
        })
    }
}
export const getCategoryByIdController=async(req,res)=>{
    const id=req.params.id
    const user_id=req.user.id
    try{
        const result=await getCategoryByIdService(id,user_id)
        if(result){
            res.status(200).json({
                message:"you get the category sucessfully ",
                result
            })
        }
    }catch(error){
        res.status(error.status || 500).json({message:error.message || "internal server error"})
    }
}
export const updateCategoryController=async(req,res)=>{
    try {
        const id=req.params.id
        const user_id=req.user.id
        const {name,type}=req.body
        const result=await updateCategoryService(id,user_id,{name,type})
        if(result){
            res.status(200).json({
                message:"category updated successfully",
                result
            })
        }
}catch (error) {
    res.status(error.status || 500).json({
        message:error.message
    })
}
}

export const deleteCategoryController=async(req,res)=>{
    const user_id=req.user.id
    const id=req.params.id
    try {
        const result=await deleteCategoryService(id,user_id)
        if(result){
            res.status(200).json({
                message:"the category deleted sucessfully"
            })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            message:error.message
        })
    }
}