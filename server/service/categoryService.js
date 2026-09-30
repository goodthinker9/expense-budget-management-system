import {createCategoryModel,getCategoryModel,getUserModelById,findcategoryName,checkIdExist,getCategoryByIdModel} from "../model/categoryModel.js"

export const createCategoryService = async (data) => {
    const { user_id, name, type } = data;

    if (!user_id || !name || !type) {
        const error = new Error("user_id, name, type are required");
        error.status = 400;
        throw error;
    }
    const isNameExist = await findcategoryName(user_id, name);
    if(isNameExist){
        const error = new Error("category name already exist");
        error.status = 400;
        throw error;
    }
    const category = await createCategoryModel(data);

    return category;
};

export const getCategoryService = async (user_id) => {
    const checkUserId = await getUserModelById(user_id);

    if (!checkUserId || checkUserId.length === 0) {
        const error = new Error("the user not found");
        error.status = 404;
        throw error;
    }
    const getCategory = await getCategoryModel(user_id);

    if (!getCategory || getCategory.length === 0) {
        const error = new Error("the category not found");
        error.status = 404;
        throw error;
    }
    return getCategory;
};
        // const result=await getCategoryByIdService(id)
export const getCategoryByIdService=async(id,user_id)=>{
    const isIdExist=await checkIdExist(id,user_id)
    if(!isIdExist){
        const error=Error("the category not found")
        error.status=404
        throw error
    }
    const result=await getCategoryByIdModel(id,user_id)
    return result
}