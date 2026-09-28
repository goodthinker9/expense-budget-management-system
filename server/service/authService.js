import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {checkuserExist,registerUserModel} from "../model/authModel.js"
export const registerService=async(data)=>{
    const {name,email,password}=data
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    if(!name || !email || !password){
        const error = new Error("name,email and password are required")
        error.status=400
        throw error
    }
    if(!isValidEmail(email)){
        const error = new Error("invalid email format")
        error.status=400
        throw error  
    }
    const isuserExist=await checkuserExist(email)
    if(isuserExist){
        const error = new Error("user already exists")
        error.status=400
        throw error
    }
    const hashedPassword=await bcrypt.hash(password,10)
    data.password=hashedPassword
    const registeruser=await registerUserModel(data)
    if(!registeruser){
        const error = new Error("failed to register user")
        error.status=500
        throw error
    }
    return registeruser
}

export const loginService=async(data)=>{
    const {email,password}=data
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    if(!email || !password){
        const error = new Error("email and password are required")
        error.status=400
        throw error
    }
    if(!isValidEmail(email)){
        const error = new Error("invalid email format")
        error.status=400
        throw error  
    }
    const isuserExist=await checkuserExist(email)
    console.log(isuserExist)
    if(!isuserExist){
        const error = new Error("user does not exist")
        error.status=400
        throw error
    }
    // console.log("User role:", isuserExist.role);
    const isPasswordMatch=await bcrypt.compare(password,isuserExist.password)
    if(!isPasswordMatch){
        const error = new Error("invalid password")
        error.status=400
        throw error
    }
    const token = jwt.sign({ id: isuserExist.id, role: isuserExist.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    data.token=token
    // console.log(isuserExist.role)
    const user={
        id:isuserExist.id,
        role:isuserExist.role,
        name:isuserExist.name,
        email:isuserExist.email
    }
    return {
        user,
        token
    }
}