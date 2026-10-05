import { checkIdExist} from "../model/categoryModel.js"
import { createTransactionModel ,getTransactionModel,getTransactionModelById,updateTransactionModel,deleteTransactionModel,getTransactionByTypeModel} from "../model/transactionModel.js"
export const createTransactionService=async(data,user_id)=>{
    const {amount,category_id,description,transaction_date}=data
    if(!amount || !category_id  || !transaction_date){
        const error = new Error("all fields are required")
        error.status=400
        throw error
    }
    const cateogoryIds=await checkIdExist(category_id,user_id)
    if(!cateogoryIds){
        const error = new Error("the category does not belong to this user");
        error.status = 400;
        throw error;
    }
    if(isNaN(amount) || amount <= 0){
        const error = new Error("amount must be a positive number")
        error.status=400
        throw error
    }
    const createTransaction=await createTransactionModel(data,user_id)
    if(!createTransaction){
        const error = new Error("failed to create transaction")
        error.status=500
        throw error
    }
    return createTransaction;

}
export const getTransactionService = async (
    user_id,
    type,
    start_date,
    end_date
) => {

    if (type && type !== "income" && type !== "expense") {
        const error = new Error("type must be income or expense");
        error.status = 400;
        throw error;
    }

    if ((start_date && !end_date) || (!start_date && end_date)) {
        const error = new Error(
            "start_date and end_date must be provided together"
        );
        error.status = 400;
        throw error;
    }

    if (start_date && end_date) {
        const start = new Date(start_date);
        const end = new Date(end_date);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            const error = new Error("invalid date format");
            error.status = 400;
            throw error;
        }

        if (start > end) {
            const error = new Error(
                "start_date cannot be after end_date"
            );
            error.status = 400;
            throw error;
        }
    }
 if (!type && !start_date && !end_date) {
        return await getTransactionModel(user_id);
    }

    return await getTransactionByTypeModel(user_id, type,start_date, end_date);

    // Model call will come here
};
export const getTransactionServiceById=async(user_id,transaction_id)=>{
    const getTransaction=await getTransactionModelById(user_id,transaction_id)
    if(!getTransaction){
        const error = new Error("no transaction found")
        error.status=404
        throw error
    }
    return getTransaction
}
export const updateTransactionService=async(user_id,transaction_id,data)=>{
    const {amount,category_id,description,transaction_date}=data
    if(!amount || !category_id  || !transaction_date){
        const error = new Error("all fields are required")
        error.status=400
        throw error
    }
    const transaction=await getTransactionModelById(user_id,transaction_id)
    if(!transaction){
        const error = new Error("transaction not found")
        error.status = 404
        throw error
    }
    const cateogoryIds=await checkIdExist(category_id,user_id)
    if(!cateogoryIds){
        const error = new Error("the category does not belong to this user");
        error.status = 400;
        throw error;
    }
    if(isNaN(amount) || amount <= 0){
        const error = new Error("amount must be a positive number")
        error.status=400
        throw error
    }
    const updateTransaction=await updateTransactionModel(user_id,transaction_id,data)
    if(!updateTransaction){
        const error = new Error("failed to update transaction")
        error.status=500
        throw error
    }
    return updateTransaction;
}
export const deleteTransactionService=async(user_id,transaction_id)=>{
    const transaction=await getTransactionModelById(user_id,transaction_id)
    if(!transaction){
        const error = new Error("transaction not found")
        error.status = 404
        throw error
    }
    const deleteTransaction=await deleteTransactionModel(user_id,transaction_id)
    if(!deleteTransaction){
        const error = new Error("failed to delete transaction")
        error.status=500
        throw error
    }
    return deleteTransaction;
}