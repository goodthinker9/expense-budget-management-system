import db from "../config/db.js"
export const getAllUserModel=async()=>{
    const sql="SELECT id, name, email, role FROM users"
    const [result] = await db.query(sql)
    return result
}
export const getUserByIdModel=async(id)=>{
    const sql="SELECT id, name, email, role FROM users WHERE id=?"
    const [result] = await db.query(sql, [id])
    return result[0]
}