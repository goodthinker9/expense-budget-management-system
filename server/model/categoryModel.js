import db from "../config/db.js"
export const createCategoryModel=async(data)=>{
    const {user_id,name,type}=data
    const sql =`INSERT INTO categories (user_id,name,type) VALUES (?,?,?)`
    const [result] = await db.execute(sql, [user_id,name,type])
    // console.log(result)
    return result
}
export const getCategoryModel=async(user_id)=>{
    const sql=`SELECT * FROM categories WHERE user_id=?`
    const [result]=await db.query(sql,[user_id])
    return result
}
export const getUserModelById=async(user_id)=>{
    const sql=`SELECT * FROM users WHERE id=?`
    const [result]=await db.query(sql,[user_id])
    return result
}
export const findcategoryName=async(user_id,name)=>{
    const sql=`SELECT * FROM categories WHERE user_id=? AND name=?`
    const [result]=await db.query(sql,[user_id,name])
    return result[0]
}