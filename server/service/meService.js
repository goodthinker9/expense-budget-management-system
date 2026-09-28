import {getAllUserModel,getUserByIdModel} from "../model/meModel.js"
export const getAllUserService=async()=>{
    const getUser=await getAllUserModel()
    if(!getUser){
        const error=new Error("user not found")
        error.status=404
        throw error
    }
    // console.log(getUser)
    return getUser
}
export const getUserServiceById=async(id)=>{
    const checkUser=await getUserByIdModel(id)
    if(!checkUser){
        const error=new Error("user not found")
        error.status=404
        throw error
    }
    return checkUser
}