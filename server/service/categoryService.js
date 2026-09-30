import {createCategoryModel,
        getCategoryModel,
        getUserModelById,
        findcategoryName,
        checkIdExist,
        getCategoryByIdModel,
        checkUpdateCategoryExist,
        updateCategoryModel,
    deleteCategoryModel} from "../model/categoryModel.js"

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
export const updateCategoryService = async (id, user_id, data) => {
    const { name, type } = data;

    // 1. Validate required fields
    if (!name || !type) {
        const error = new Error("name and type are required");
        error.status = 400;
        throw error;
    }

    // 2. Validate category type
    if (type !== "income" && type !== "expense") {
        const error = new Error("type must be income or expense");
        error.status = 400;
        throw error;
    }

    // 3. Check whether the category belongs to this user
    const isBelong = await checkIdExist(id, user_id);

    if (!isBelong) {
        const error = new Error("the category not found");
        error.status = 404;
        throw error;
    }

    // 4. Check whether another category has the same name
    const isNameExist = await checkUpdateCategoryExist(
        user_id,
        name,
        id
    );

    if (isNameExist) {
        const error = new Error(
            "the category name already exists"
        );
        error.status = 400;
        throw error;
    }

    // 5. Update will be called here
    const updatedCategory = await updateCategoryModel(
        id,
        user_id,
        name,
        type
    );

    return updatedCategory;
};
export const deleteCategoryService=async(id,user_id)=>{
    const checkexist=await checkIdExist(id,user_id)
    if(!checkexist){
    const error=Error("the category didn't find belong to this user ")
    error.status=404
    throw error
    }
    const result = await deleteCategoryModel(id,user_id)
    return result
}