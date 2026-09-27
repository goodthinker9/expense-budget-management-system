import db from "../config/db.js"
export const checkuserExist =async(email)=>{
    const sql="SELECT * FROM users WHERE email=?"
    const [result] = await db.query(sql, [email])
    return result[0]
}
export const registerUserModel=async(userData)=>{
    const {name,email,password}=userData
    const sql="INSERT INTO users(name,email,password) VALUES(?,?,?)"
    const [result] = await db.query(sql, [name,email,password])
    return result.insertId
}