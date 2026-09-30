import {getCategoryService,createCategoryService} from "../service/categoryService.js"
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